import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Select, Textarea, Button, useToast, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

function ReviewForm({ transactionId }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', { transactionId, rating, comment });
      toast({
        title: 'Review Submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setRating('');
      setComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
      <Box p={4} borderWidth={1} borderRadius="md">
        <Heading size="md" mb={4}>Leave a Review</Heading>
        <VStack as="form" onSubmit={handleSubmit} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Rating</FormLabel>
            <Select value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Select rating">
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Comment</FormLabel>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your feedback..." />
          </FormControl>
          <Button type="submit" colorScheme="green">Submit Review</Button>
        </VStack>
      </Box>
    </motion.div>
  );
}

export default ReviewForm;