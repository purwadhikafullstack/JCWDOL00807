module.exports = {
  apps: [
    {
      name: "JCWDOL-008-07", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8000807,
      },
      time: true,
    },
  ],
};
