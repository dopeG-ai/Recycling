import { useState } from 'react';
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Button, 
  useToast, 
  VStack, 
  useColorModeValue 
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const toast = useToast();
  const bg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const inputBg = useColorModeValue('white', 'gray.700');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      toast({
        title: 'Message Sent',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box 
        bg={bg} 
        py={8} 
        px={6} 
        maxW="600px" 
        mx="auto" 
        mt={8}
        borderRadius="xl"
        boxShadow="xl"
        backdropFilter="blur(10px)"
      >
        <Heading size="xl" mb={6} textAlign="center">Contact Us</Heading>
        <VStack as="form" onSubmit={handleSubmit} spacing={6}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              bg={inputBg}
              _hover={{ bg: inputBg }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              bg={inputBg}
              _hover={{ bg: inputBg }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              minH="150px"
              bg={inputBg}
              _hover={{ bg: inputBg }}
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="green" 
            size="lg" 
            width="full"
            isLoading={false}
          >
            Send Message
          </Button>
        </VStack>
      </Box>
    </motion.div>
  );
}

export default Contact;