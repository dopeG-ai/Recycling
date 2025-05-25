import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, VStack, Flex, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import MapComponent from '../components/MapComponent';
import Chat from '../components/Chat';
import axios from 'axios';

function CompanyDashboard() {
  const bg = useColorModeValue('white', 'gray.800');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await axios.post('http://localhost:5000/api/requests/accept', { requestId });
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box bg={bg} py={16} maxW="1200px" mx="auto">
        <Heading size="lg" mb={6}>Company Dashboard</Heading>
        <Flex flexDir={{ base: 'column', md: 'row' }} gap={8}>
          {/* Map & Requests */}
          <VStack flex="2" spacing={4} align="stretch">
            <Box>
              <Heading size="md" mb={4}>Pickup Requests</Heading>
              <MapComponent />
            </Box>
            <Box>
              <Heading size="md" mb={4}>Request List</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Recycler</Th>
                    <Th>Location</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests.map((req) => (
                    <Tr key={req.id}>
                      <Td>{req.recyclerName}</Td>
                      <Td>{req.location}</Td>
                      <Td>
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(req);
                            handleAccept(req.id);
                          }}
                        >
                          Accept
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
          {/* Chat */}
          <VStack flex="1" spacing={4} align="stretch">
            <Box p={4} borderWidth={1} borderRadius="md">
              <Heading size="md" mb={4}>Chat</Heading>
              {selectedRequest ? (
                <Chat userId="company123" companyId={selectedRequest.recyclerId} />
              ) : (
                <Text>Select a request to start chatting</Text>
              )}
            </Box>
          </VStack>
        </Flex>
      </Box>
    </motion.div>
  );
}

export default CompanyDashboard;