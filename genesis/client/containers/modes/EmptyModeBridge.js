function EmptyModeBridge({ children }) {
  return children({ register: {}, connect: {} });
}

export { EmptyModeBridge };