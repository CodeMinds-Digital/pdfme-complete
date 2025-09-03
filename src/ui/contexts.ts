import { createContext } from 'react';
import { i18n } from './i18n';
import { getDefaultFont, PluginRegistry, pluginRegistry, UIOptions } from '../common';
import { builtInPlugins } from '../schemas';

export const I18nContext = createContext(i18n);

export const FontContext = createContext(getDefaultFont());

export const PluginsRegistry = createContext<PluginRegistry>(pluginRegistry(builtInPlugins));

export const OptionsContext = createContext<UIOptions>({});

export const CacheContext = createContext<Map<string | number, unknown>>(new Map());
