import * as React from 'react';
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache,} from '@apollo/client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { onError } from '@apollo/client/link/error';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import axios from 'axios';
// import PacmanLoader from 'react-spinners/PacmanLoader';

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.forEach(({message, location, path}) => {
      alert(`GraphQl has an error: ${message}`);
    });
  }
}); 

const link = from([
  errorLink,
  new HttpLink({uri:'https://api.opensea.io/api/v1/collections?offset=0&limit=100'})
]);

// eslint-disable-next-line no-unused-vars
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function ProductValues() {
    // eslint-disable-next-line no-unused-vars
  	const [assets, setAssets] = useState([]);
    // eslint-disable-next-line no-unused-vars
  	const [isLoading, setIsLoading] = useState(false);
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
  	    const {
  	      data
  	    } = await axios.get('https://api.opensea.io/api/v1/assets?order_direction=desc&limit=3&include_orders=false', config);
  	    setAssets(data);
  	    setIsLoading(false);
  	  })();
  	  return () => {
  	    console.log('Unloading initial call...');
  	  }
  	}, []);

  return (
    <ApolloProvider>
      
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light', mt: 20 }}
    >
      <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
        <Box
          component="img"
          src="/static/productCurvyLines.png"
          alt="curvy lines"
          sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/static/productValues1.svg"
                alt="suitcase"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                Browse, Buy, Relax
              </Typography>
              <Typography variant="h5">
                {'MoonBay is your go to site for finding the top NFT collections'}
                {', browse with ease.'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/static/productValues2.svg"
                alt="graph"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                Take Harbor
              </Typography>
              <Typography variant="h5">
                {'Like your favorite NFTs in an instant,'}
                {' and show off your favorites.'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src="/static/productValues3.svg"
                alt="clock"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                Free To Use
              </Typography>
              <Typography variant="h5">
                {'MoonBay is a free to use site'}
                {' that you will not find anywhere else.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </ApolloProvider>
  );
}

export default ProductValues;
