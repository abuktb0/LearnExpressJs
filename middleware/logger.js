const logger = (req, res, next) => {
    console.log(
        `Method: ${req.method}
         URI: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    )
    next()
}

module.exports = logger