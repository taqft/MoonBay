import * as React from 'react';
import { useState, useEffect } from 'react';
import AppAppBar from './AppAppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import withRoot from '../withRoot';
import axios from 'axios';
// import Fab from '@mui/material/Fab';
// import Link from '@mui/material/Link';

function TopCollection() {
  const [assets, setAssets] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      let config = {
        headers: {
          Accept: 'application/json',
          'X-API-KEY': process.env.REACT_APP_API_KEY
        }
      }
      setIsLoading(true);
      const { data } = await axios.get('https://api.opensea.io/api/v1/assets?order_direction=desc&limit=3&include_orders=false', config);
      setAssets(data.assets);
      setIsLoading(false);
    })();
    return () => {
      console.log('Unloading initial call...');
    }
  }, []);

  console.log(assets);

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
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }} >
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
              Recent Mints
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Here's some of the latest NFTs:
            </Typography>
            <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
            </Stack>
          </Container>
        </Box>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {
              assets.length === 0 ?
                <h1>Loading...</h1>
                :
                assets.map((asset, i) => (
                  <Grid item key={asset.id} xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        image={
                          assets[i].image_url === null ?
                            'https://source.unsplash.com/random/?moon,space' :
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
                        <Button
                          sx={{ width: '90%' }}
                          size="large"
                          href={`${assets[i].permalink}`}
                          target="_blank">
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}

export default withRoot(TopCollection);
