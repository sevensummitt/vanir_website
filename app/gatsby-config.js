if (process.env.IS_LOCAL || process.env.NODE_ENV !== 'production') {
  console.info('Loading dotenv...')
  // eslint-disable-next-line global-require
  require('dotenv').config()
}

const config = {
  siteMetadata: {
    title: 'josef.aidt',
    author: '@josefaidt',
    siteUrl: 'https://josefaidt.dev',
    keywords: ['josef', 'aidt', 'personal', 'portfolio'],
    description: 'Welcome to my personal site',
    social: [
      {
        name: `Twitter`,
        url: `https://twitter.com/josefaidt`,
      },
      {
        name: `GitHub`,
        url: `https://github.com/josefaidt`,
      },
    ],
  },
  plugins: [
    { resolve: '@josefaidt/gatsby-theme', options: { offline: true } },
    {
      resolve: '@dschau/gatsby-source-github',
      options: {
        headers: {
          Authorization: `Bearer ${process.env.GH_TOKEN}`,
        },
        queries: [
          `{
        user(login: "josefaidt") {
          id
          url
          avatarUrl,
          name
          repositories(orderBy: {field: PUSHED_AT, direction: DESC}, first: 15, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
            totalCount
            edges {
              node {
                id
                name
                description
                url
                homepageUrl
                
                stargazers {
                  totalCount
                }
                watchers {
                  totalCount
                }
                forks {
                  totalCount
                }
              }
            }
          }
        }
      }`,
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-sentry',
      options: {
        dsn: process.env.SENTRY_DSN,
        // Optional settings, see https://docs.sentry.io/clients/node/config/#optional-settings
        environment: process.env.NODE_ENV,
        enabled: (() => ['production', 'stage'].indexOf(process.env.NODE_ENV) !== -1)(),
      },
    },
    'gatsby-plugin-netlify',
  ],
}

if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production') {
  config.plugins.push({
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: process.env.GOOGLE_ANALYTICS,
      // Defines where to place the tracking script - `true` in the head and `false` in the body
      head: false,
      anonymize: true,
      respectDNT: true,
    },
  })
}

module.exports = config
