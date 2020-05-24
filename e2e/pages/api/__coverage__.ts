export default (req, res) => {
  res.status(200).json({
    //@ts-ignore
    coverage: global.__coverage__ || null
  })
}
