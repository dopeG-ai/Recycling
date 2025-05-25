import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Select, Button, useToast, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

function PaymentSetup({ userId }) {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [formData, setFormData] = useState({
    accountHolder: '',
    accountType: '',
    branchCode: '',
    accountNumber: '',
    phoneNumber: '',
    alternatePhone: '',
    address: '',
    city: '',
    postalCode: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/payment', { userId, paymentMethod, ...formData });
      toast({
        title: 'Payment Details Saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save payment details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box p={4} borderWidth={1} borderRadius="md">
        <Heading size="md" mb={4}>Payment Setup</Heading>
        <VStack as="form" onSubmit={handleSubmit} spacing={4}>
          {/* Contact Information */}
          <Box w="100%" p={4} borderWidth={1} borderRadius="md" mb={4}>
            <Heading size="sm" mb={4}>Contact Details</Heading>
            <FormControl isRequired mb={3}>
              <FormLabel>Phone Number</FormLabel>
              <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter primary phone number" />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Alternative Phone</FormLabel>
              <Input name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} placeholder="Enter alternative phone number" />
            </FormControl>
            <FormControl isRequired mb={3}>
              <FormLabel>Address</FormLabel>
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" />
            </FormControl>
            <FormControl isRequired mb={3}>
              <FormLabel>City</FormLabel>
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="Enter your city" />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Postal Code</FormLabel>
              <Input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Enter postal code" />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Emergency Contact Name</FormLabel>
              <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Enter emergency contact name" />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Emergency Contact Phone</FormLabel>
              <Input name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="Enter emergency contact phone" />
            </FormControl>
          </Box>

          {/* Payment Information */}
          <Box w="100%" p={4} borderWidth={1} borderRadius="md">
            <Heading size="sm" mb={4}>Payment Information</Heading>
            <FormControl isRequired mb={3}>
              <FormLabel>Payment Method</FormLabel>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="bank">Bank Transfer</option>
                <option value="ewallet">eWallet</option>
              </Select>
            </FormControl>
            
            {paymentMethod === 'bank' && (
              <>
                <FormControl isRequired mb={3}>
                  <FormLabel>Account Holder Name</FormLabel>
                  <Input name="accountHolder" value={formData.accountHolder} onChange={handleChange} placeholder="Enter account holder name" />
                </FormControl>
                <FormControl isRequired mb={3}>
                  <FormLabel>Account Type</FormLabel>
                  <Select name="accountType" value={formData.accountType} onChange={handleChange}>
                    <option value="">Select account type</option>
                    <option value="savings">Savings</option>
                    <option value="checking">Checking</option>
                    <option value="current">Current</option>
                  </Select>
                </FormControl>
                <FormControl isRequired mb={3}>
                  <FormLabel>Branch Code</FormLabel>
                  <Input name="branchCode" value={formData.branchCode} onChange={handleChange} placeholder="Enter branch code" />
                </FormControl>
                <FormControl isRequired mb={3}>
                  <FormLabel>Account Number</FormLabel>
                  <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter account number" />
                </FormControl>
              </>
            )}
            
            {paymentMethod === 'ewallet' && (
              <FormControl isRequired mb={3}>
                <FormLabel>eWallet Number</FormLabel>
                <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter eWallet number" />
              </FormControl>
            )}
          </Box>

          <Button type="submit" colorScheme="green" size="lg" w="100%">
            Save Payment & Contact Details
          </Button>
        </VStack>
      </Box>
    </motion.div>
  );
}

export default PaymentSetup;