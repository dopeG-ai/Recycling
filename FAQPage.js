import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';

function FAQPage() {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box bg={bg} py={16}>
        <Heading size="2xl" textAlign="center" mb={8}>Frequently Asked Questions</Heading>
        <FAQ />
      </Box>
    </motion.div>
  );
}

export default FAQPage;