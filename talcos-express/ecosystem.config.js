module.exports = {
    apps: [
        {
            name: 'talcos-express',
            script: './config/config.js',
            watch: true,
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            }
        }
    ]
};
