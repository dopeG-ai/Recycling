import { Box, Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function About() {
  const bg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const color = useColorModeValue('gray.800', 'white');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box 
        bg={bg} 
        color={color} 
        py={16} 
        maxW="800px" 
        mx="auto" 
        textAlign="center"
        backdropFilter="blur(10px)"
        borderRadius="xl"
        boxShadow="xl"
        m={4}
      >
        <VStack spacing={6} p={6}>
          <Heading size="2xl" mb={4}>About RecyclePay</Heading>
          <Text fontSize="xl" lineHeight="tall">
            RecyclePay is dedicated to making recycling easy and rewarding. Our platform connects recyclers with local pickup companies, turning waste into cash while promoting sustainability.
          </Text>
          <Text fontSize="xl" fontWeight="medium">Join us in building a greener future!</Text>
        </VStack>
      </Box>
    </motion.div>
  );
}

export default About;