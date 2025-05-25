import { Box, Heading, Text, Button, Flex, useColorModeValue, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Home() {
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bg} color={color} py={16} textAlign="center">
      <Flex maxW="800px" mx="auto" flexDir="column" align="center" gap={6}>
        <Heading size="2xl">Recycle & Earn Cash</Heading>
        <Text fontSize="lg">Turn your recyclable waste into money with our easy-to-use platform. Connect with local pickup companies and get paid securely.</Text>
        <HStack spacing={4}>
          <Button as={Link} to="/register" colorScheme="green" size="lg">Get Started</Button>
          <Button as={Link} to="/login" colorScheme="green" variant="outline" size="lg">Sign In</Button>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Home;