import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, VStack, Flex, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import MapComponent from '../components/MapComponent';
import PaymentSetup from '../components/PaymentSetup';
import ReviewForm from '../components/ReviewForm';
import Leaderboard from '../components/Leaderboard';
import axios from 'axios';

function RecyclerDashboard() {
  const bg = useColorModeValue('white', 'gray.800');
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/users/me');
        const txRes = await axios.get('http://localhost:5000/api/transactions');
        setUser(userRes.data);
        setTransactions(txRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box bg={bg} py={16} maxW="1200px" mx="auto">
        <Heading size="lg" mb={6}>Recycler Dashboard</Heading>
        <Flex flexDir={{ base: 'column', md: 'row' }} gap={8}>
          {/* Profile & Actions */}
          <VStack flex="1" spacing={4} align="stretch">
            <Box p={4} borderWidth={1} borderRadius="md">
              <Heading size="md">Profile</Heading>
              {user && (
                <>
                  <Text>Name: {user.name}</Text>
                  <Text>Phone: {user.phone}</Text>
                  <Text>Email: {user.email}</Text>
                  <Text>Location: {user.location}</Text>
                </>
              )}
              <Button colorScheme="green" mt={2}>Edit Profile</Button>
            </Box>
            <PaymentSetup userId={user?.id} />
            <ReviewForm transactionId={transactions[0]?.id} />
          </VStack>
          {/* Map, Transactions, Leaderboard */}
          <VStack flex="2" spacing={4} align="stretch">
            <Box>
              <Heading size="md" mb={4}>Your Location</Heading>
              <MapComponent />
            </Box>
            <Box>
              <Heading size="md" mb={4}>Transaction History</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Amount (ZAR)</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((tx) => (
                    <Tr key={tx.id}>
                      <Td>{tx.date}</Td>
                      <Td>{tx.amount}</Td>
                      <Td>{tx.status}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Leaderboard />
          </VStack>
        </Flex>
      </Box>
    </motion.div>
  );
}

export default RecyclerDashboard;