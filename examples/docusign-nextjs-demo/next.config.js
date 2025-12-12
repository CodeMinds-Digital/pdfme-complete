/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Handle canvas for PDF generation
        if (isServer) {
            config.externals.push('canvas');
        }

        // Handle PDF.js worker
        config.resolve.alias = {
            ...config.resolve.alias,
            'pdfjs-dist/build/pdf.worker.js': 'pdfjs-dist/build/pdf.worker.min.js',
        };

        // Handle ES modules
        config.module.rules.push({
            test: /\.m?js$/,
            type: 'javascript/auto',
            resolve: {
                fullySpecified: false,
            },
        });

        return config;
    },
    transpilePackages: ['@codeminds-digital/pdfme-complete'],
}

module.exports = nextConfig