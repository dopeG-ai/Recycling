import { useState, useEffect, useRef } from 'react';
import { Box, VStack, Input, Button, Text, useColorModeValue, IconButton } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat({ userId, companyId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (message.trim()) {
      const msg = { userId, companyId, text: message, timestamp: new Date() };
      socket.emit('message', msg);
      setMessages((prev) => [...prev, msg]);
      setMessage('');
      scrollToBottom();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          width: isMinimized ? '200px' : '300px',
        }}
      >
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg={bg}
          borderColor={borderColor}
          boxShadow="lg"
        >
          {/* Chat Header */}
          <Box
            p={3}
            bg="green.500"
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            cursor="pointer"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Text fontWeight="bold">Chat</Text>
            <IconButton
              icon={<SmallCloseIcon />}
              size="sm"
              variant="ghost"
              color="white"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              _hover={{ bg: 'green.600' }}
            />
          </Box>

          {/* Chat Body */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  height="300px"
                  overflowY="auto"
                  p={3}
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'gray.200',
                      borderRadius: '24px',
                    },
                  }}
                >
                  <VStack spacing={2} align="stretch">
                    {messages.map((msg, index) => (
                      <Box
                        key={index}
                        alignSelf={msg.userId === userId ? 'flex-end' : 'flex-start'}
                        bg={msg.userId === userId ? 'green.500' : 'gray.100'}
                        color={msg.userId === userId ? 'white' : 'black'}
                        px={3}
                        py={2}
                        borderRadius="lg"
                        maxW="80%"
                      >
                        <Text fontSize="sm">{msg.text}</Text>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </VStack>
                </Box>

                <Box p={3} borderTopWidth="1px" borderColor={borderColor}>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    mb={2}
                  />
                  <Button width="full" colorScheme="green" onClick={sendMessage}>
                    Send
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

export default Chat;