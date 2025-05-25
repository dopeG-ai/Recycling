import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  Alert,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'recycler',
    vehicleType: 'van',
    vehicleCapacity: '',
    serviceAreas: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Sending registration data:', formData); // Debug log
      const response = await axiosInstance.post('/auth/register', formData);
      
      console.log('Registration response:', response.data); // Debug log
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error.response || error); // Debug log
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Box
        py={{ base: '8', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'xs', md: 'sm' }}>Create your account</Heading>
            </Stack>
          </Stack>
          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              {error && (
                <Alert status="error">
                  {error}
                </Alert>
              )}
              <Stack spacing="5">
                <FormControl isRequired>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <Select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="recycler">Recycler</option>
                    <option value="company">Company</option>
                    <option value="transport">Transport Provider</option>
                  </Select>
                </FormControl>
                {formData.role === 'transport' && (
                  <>
                    <FormControl isRequired>
                      <FormLabel htmlFor="vehicleType">Vehicle Type</FormLabel>
                      <Select
                        id="vehicleType"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                      >
                        <option value="van">Van</option>
                        <option value="truck">Truck</option>
                        <option value="pickup">Pickup</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel htmlFor="vehicleCapacity">Vehicle Capacity (kg)</FormLabel>
                      <Input
                        id="vehicleCapacity"
                        name="vehicleCapacity"
                        type="number"
                        min="100"
                        value={formData.vehicleCapacity}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel htmlFor="serviceAreas">Service Areas</FormLabel>
                      <Input
                        id="serviceAreas"
                        name="serviceAreas"
                        type="text"
                        placeholder="Enter service areas (comma separated)"
                        value={formData.serviceAreas}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </>
                )}
              </Stack>
              <Stack spacing="6">
                <Button
                  type="submit"
                  colorScheme="green"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                >
                  Register
                </Button>
              </Stack>
            </Stack>
          </form>
          <Stack pt={6}>
            <Box align={'center'}>
              Already a user?{' '}
              <ChakraLink as={Link} to="/login" color={'green.400'}>
                Login
              </ChakraLink>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

export default Register;
