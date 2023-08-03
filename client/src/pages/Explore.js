import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
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
import axios from 'axios';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../utils/mutations';
import { QUERY_FAVORITES } from '../utils/queries';
import Auth from '../utils/auth';
import Copyright from './modules/components/Copyright';

function Explore() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const { loading, data, refetch } = useQuery(QUERY_FAVORITES);
  const oldFavorites = data?.assets || [];
  const navigate = useNavigate();

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
    if (!Auth.loggedIn()) {
      try {
        navigate("/login");
      } catch (err) {
        console.error(err);
      }
    }
    else if (assetClassName.includes(' red ')) {
      //remove favorite
      try {
        //eslint-disable-next-line
        const { dataRemoved } = await removeFavorite({
          variables: {
            assetUser: Auth.getUser().data.username,
            openSeaId: assetOpenSeaId
          },
        });
        setIsActive(null);
        await refetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        //eslint-disable-next-line
        const { dataAdded } = await addFavorite({
          variables: {
            name: assetName,
            permalink: assetPermalink,
            image_url: assetImage_url,
            assetUser: Auth.getUser().data.username,
            openSeaId: assetOpenSeaId,
          },
        });
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
      let config = {
        headers: {
          Accept: 'application/json',
          'X-API-KEY': process.env.REACT_APP_API_KEY
        }
      }
      setIsLoading(true);
      const { data } = await axios.get('https://api.opensea.io/api/v1/assets?order_direction=desc&limit=12&include_orders=false', config);
      setAssets(data.assets);
      setIsLoading(false);
    })();
    return () => {
      console.log('Unloading initial call...');
    }
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
              Explore Collections
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              View what's hot and decide what collection fits your taste
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
          {/* End hero unit */}
          <Grid container spacing={4}>
            {
              assets.length === 0 || isLoading || loading ? (
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
                assets.map((asset, i) => (
                  <Grid item key={asset.id} xs={12} sm={6} md={3}>
                    <Card
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          assets[i].image_url === null ?
                            'https://source.unsplash.com/random/?moon,space'
                            :
                            `${assets[i].image_url}`
                        }
                        alt="random"
                        sx={{ maxHeight: '264px' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {
                            assets[i].name ?
                              assets[i].name :
                              `${assets[i].collection.name} #${assets[i].token_id}`
                          }
                        </Typography>
                        <Typography
                          style={{ wordWrap: "break-word" }}
                          sx={{ height: '90%', maxHeight: '250px', overflow: 'auto' }} >
                          {assets[i].collection.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-evenly' }}>
                        <IconButton href={`${assets[i].permalink}`} target="_blank" alt="OpenSea"><img src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg" alt="OpenSea" width="35px" /></IconButton>
                        <Button size="small" className={'gray'}><ShoppingCartIcon /></Button>
                        <IconButton
                          size="small"
                          aria-label="like"
                          data-name={
                            assets[i].name ? assets[i].name :
                              `${assets[i].collection.name} #${assets[i].token_id}`
                          }
                          data-image_url={
                            assets[i].image_url === null ?
                              'https://source.unsplash.com/random/?moon,space'
                              :
                              `${assets[i].image_url}`
                          }
                          data-permalink={`${assets[i].permalink}`}
                          data-id={asset.id}
                          //eslint-disable-next-line
                          className={(isActive === i) || (oldFavorites.some(e => e.openSeaId == asset.id)) ? 'red' : 'gray'}
                          onClick={(event) => toggleIsActive(i, event)} >
                          <FavoriteIcon pointerEvents="none" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>

                ))}
          </Grid>
        </Container>
      </main>
      <AppFooter />
      <Copyright />
    </React.Fragment>
  );
}

export default withRoot(Explore);
