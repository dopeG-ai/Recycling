import React from 'react';
import { Box, Container, Stack, Text, IconButton, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="footer"
      py={3}
      px={2}
      mt="auto"
      bg={colorMode === 'light' ? 'green.50' : 'gray.800'}
      borderTop="1px solid"
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
    >
      <Container maxW="container.lg">
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={4}
          justify="space-between"
          align="center"
        >
          <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
            © {new Date().getFullYear()} RecyclePay. All rights reserved.
          </Text>
          
          <Stack direction="row" spacing={2}>
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="green"
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
            />
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="green"
              icon={<FaFacebook />}
              aria-label="Facebook"
            />
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="green"
              icon={<FaTwitter />}
              aria-label="Twitter"
            />
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="green"
              icon={<FaInstagram />}
              aria-label="Instagram"
            />
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="green"
              icon={<FaLinkedin />}
              aria-label="LinkedIn"
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;