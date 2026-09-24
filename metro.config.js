// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// The marketing website is a separate Next.js project; keep Metro out of it.
const escaped = path.join(__dirname, 'website').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [new RegExp(`^${escaped}[/\\\\]`)];

module.exports = config;
