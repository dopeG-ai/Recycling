import { 
  Box, 
  Heading, 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon,
  useColorModeValue
} from '@chakra-ui/react';

function FAQ() {
  const bg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const itemBg = useColorModeValue('white', 'gray.700');

  const faqs = [
    { 
      q: 'How do I get paid?', 
      a: 'You can choose bank transfer or eWallet (e.g., FNB, Capitec). Payments are processed within 24-48 hours after pickup confirmation.' 
    },
    { 
      q: 'What materials can I recycle?', 
      a: 'We accept paper, plastic (types 1-7), glass, and metal. Check our materials guide for specific items and preparation instructions.' 
    },
    { 
      q: 'How does pickup work?', 
      a: 'Once you schedule a pickup, local recycling partners in your area will be notified. You\'ll receive confirmation of the pickup time and can track the status in real-time.' 
    },
    { 
      q: 'What are the minimum quantities for pickup?', 
      a: 'The minimum quantity varies by material type. Generally, we recommend at least 5kg of mixed recyclables or 3kg of a single material type.' 
    },
    { 
      q: 'How are recycling rates calculated?', 
      a: 'Rates are based on current market prices and material quality. You can check current rates in the app, and prices are locked in when you schedule a pickup.' 
    }
  ];

  return (
    <Box maxW="800px" mx="auto" py={8} px={4}>
      <Box
        bg={bg}
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        backdropFilter="blur(10px)"
      >
        <Heading size="xl" mb={8} textAlign="center">Frequently Asked Questions</Heading>
        <Accordion allowToggle>
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              bg={itemBg} 
              mb={4} 
              borderRadius="md" 
              overflow="hidden"
            >
              <AccordionButton py={4} px={6}>
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {faq.q}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} px={6}>
                {faq.a}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Box>
  );
}

export default FAQ;