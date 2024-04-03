import { Flex, Spinner } from '@chakra-ui/react'

export function Loading() {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      zIndex="9000"
      width="100vw"
      height="100vh"
      direction="column"
      align="center"
      justify="center"
      bg="rgba(0, 0, 0, 0.5)"
    >
      <Spinner color="white" />
    </Flex>
  )
}