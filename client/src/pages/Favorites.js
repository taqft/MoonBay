import * as React from 'react';
import AppAppBar from './modules/views/AppAppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import withRoot from './modules/withRoot';
import AppFooter from './modules/views/AppFooter';
import Copyright from './modules/components/Copyright';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../utils/mutations';
import { QUERY_FAVORITES } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';

function Favorites() {
  // eslint-disable-next-line no-unused-vars
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const { loading, data, refetch } = useQuery(QUERY_FAVORITES);
  const oldFavorites = data?.assets || [];

  const [addFavorite, { addError }] = useMutation(ADD_FAVORITE, {
    update(cache, { data: { addFavorite } }) {
      try {
        const { assets } = cache.readQuery({ query: QUERY_FAVORITES });

        cache.writeQuery({
          query: QUERY_FAVORITES,
          data: { assets: [addFavorite, ...assets] },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const [removeFavorite, { removeError }] = useMutation(REMOVE_FAVORITE, {
    update(cache, { data: { removeFavorite } }) {
      try {
        const { assets } = cache.readQuery({ query: QUERY_FAVORITES });

        cache.writeQuery({
          query: QUERY_FAVORITES,
          data: { assets: [...assets] },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  // check if the clicked favorite icon is already active,
  // if so, make it inactive (gray)
  const toggleIsActive = async (i, event) => {
    const assetName = event.target.dataset.name;
    const assetPermalink = event.target.dataset.permalink;
    const assetImage_url = event.target.dataset.image_url;
    const assetOpenSeaId = event.target.dataset.id;
    const assetClassName = event.target.className;

    if (assetClassName.includes(' red ')) {
      //remove favorite
      try {
        const { dataRemoved } = await removeFavorite({
          variables: {
            assetUser: Auth.getUser().data.username,
            openSeaId: assetOpenSeaId
          },
        });
        console.log(dataRemoved);
        setIsActive(null);
        await refetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const { dataAdded } = await addFavorite({
          variables: {
            name: assetName,
            permalink: assetPermalink,
            image_url: assetImage_url,
            assetUser: Auth.getUser().data.username,
            openSeaId: assetOpenSeaId,
          },
        });
        console.log(dataAdded);
        setIsActive(i);
        await refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    // do the initial api fetching
    (async () => {
      setIsLoading(true);
      setAssets(oldFavorites);
      setIsLoading(false);
    })();
    return () => {
      console.log('Unloading initial call...');
    }
    //eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <style>{`
        .red {color: red}
        .gray {color: gray}
        p::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        p::-webkit-scrollbar-thumb {
          background: #C7C7C7;
          border-radius: 10px;
          box-shadow: none;
          border: none;
        }

        p::-webkit-scrollbar-thumb:hover {
          background: #7a7a7a;
        }

        p::-webkit-scrollbar-track {
          background: #fff;
          border-radius: 10px;
          box-shadow: inset 7px 10px 12px #f0f0f0;
          border: none;
        }
      `}</style>
      <AppAppBar />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Favorited Collections
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              The home for all of your favorite collections!
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
            </Stack>{(addError || removeError) && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {addError ? addError.message : removeError.message}
              </div>
            )}
          </Container>
        </Box>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {
              isLoading || loading ? (
                <Container maxWidth="sm">
                  <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center" >
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>
                      Loading...
                    </Typography>
                  </Stack>
                </Container>
              ) :
                oldFavorites.map((asset, i) => ( asset.name ? 
                  (<Grid item key={asset.id} xs={12} sm={6} md={3}>
                    <Card
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          oldFavorites[i].image_url === null ?
                            'https://source.unsplash.com/random/?moon,space'
                            :
                            `${oldFavorites[i].image_url}`
                        }
                        alt="random"
                        sx={{ maxHeight: '264px' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {
                            oldFavorites[i].name ?
                              oldFavorites[i].name :
                              `no name given`
                          }
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-evenly' }}>
                        <IconButton href={`${oldFavorites[i].permalink}`} target="_blank" alt="OpenSea"><img src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg" alt="OpenSea" width="35px" /></IconButton>
                        <Button size="small" className={'gray'}><ShoppingCartIcon /></Button>
                        <IconButton
                          size="small"
                          aria-label="like"
                          data-name={
                            oldFavorites[i].name ? oldFavorites[i].name :
                              `no name given`
                          }
                          data-image_url={
                            oldFavorites[i].image_url === null ?
                              'https://source.unsplash.com/random/?moon,space'
                              :
                              `${oldFavorites[i].image_url}`
                          }
                          data-permalink={`${oldFavorites[i].permalink}`}
                          data-id={asset.openSeaId}
                          //eslint-disable-next-line
                          className={(isActive === i) || (oldFavorites.some(e => e.openSeaId == asset.id)) ? 'red' : 'gray'}
                          onClick={(event) => toggleIsActive(i, event)} >
                          <FavoriteIcon pointerEvents="none" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>) : (
                    <></>
                  )))}
          </Grid>
        </Container>
      </main>
      <AppFooter />
      <Copyright />
    </React.Fragment>
  );
}

export default withRoot(Favorites);
