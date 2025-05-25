import { useState, useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const bg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/leaderboard');
        setLeaders(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box p={4} borderWidth={1} borderRadius="md" bg={bg}>
        <Heading size="md" mb={4}>Weekly Leaderboard</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Name</Th>
              <Th>Earnings (ZAR)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leaders.map((leader, index) => (
              <Tr key={leader.id}>
                <Td>{index + 1}</Td>
                <Td>{leader.name}</Td>
                <Td>{leader.earnings}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </motion.div>
  );
}

export default Leaderboard;