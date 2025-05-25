import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
} from '@chakra-ui/react';
import axios from 'axios';

function PaymentTransaction({ userId, transactionType }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paymentDetails: {},
  });
  
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setFormData(prev => ({
      ...prev,
      paymentDetails: {}
    }));
  };

  const validateForm = () => {
    if (!formData.amount || isNaN(formData.amount)) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        status: 'error',
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const response = await axios.post('/api/transactions', {
        userId,
        transactionType,
        amount: parseFloat(formData.amount),
        description: formData.description,
        paymentMethod,
        paymentDetails: formData.paymentDetails,
      });

      toast({
        title: 'Success',
        description: 'Transaction processed successfully',
        status: 'success',
        duration: 3000,
      });

      // Clear form
      setFormData({
        amount: '',
        description: '',
        paymentDetails: {},
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process transaction',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        {transactionType === 'payment' ? 'Make Payment' : 'Request Payment'}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent bg={bg}>
          <ModalHeader>
            {transactionType === 'payment' ? 'Make Payment' : 'Request Payment'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack as="form" onSubmit={handleSubmit} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter transaction description"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Payment Method</FormLabel>
                <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="ewallet">eWallet</option>
                </Select>
              </FormControl>

              {paymentMethod === 'bank' && (
                <Box 
                  p={4} 
                  borderWidth="1px" 
                  borderRadius="md" 
                  borderColor={borderColor}
                  width="100%"
                >
                  <Text fontSize="sm" mb={2}>Bank Details:</Text>
                  <Text fontSize="xs">Bank: First National Bank</Text>
                  <Text fontSize="xs">Account: 1234567890</Text>
                  <Text fontSize="xs">Branch: 250655</Text>
                  <Badge colorScheme="green" mt={2}>Reference: RP-{userId}</Badge>
                </Box>
              )}

              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={isProcessing}
                loadingText="Processing..."
              >
                Confirm Transaction
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PaymentTransaction;
