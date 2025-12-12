import React, { useContext, useState, useEffect } from 'react';
import { theme, Button, Tabs } from 'antd';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { Schema, Plugin, BasePdf, getFallbackFontName } from '../../../common';
import type { SidebarProps } from '../../types';
import { UNIFIED_SIDEBAR_WIDTH, DOCUSIGN_COLORS } from '../../constants';
import { setFontNameRecursively } from '../../helper';
import { OptionsContext, PluginsRegistry } from '../../contexts';
import PluginIcon from './PluginIcon';
import Renderer from '../Renderer';
import ListView from './RightSidebar/ListView/index';
import DetailView from './RightSidebar/DetailView/index';
import FieldPalette from './FieldPalette';

const { TabPane } = Tabs;

// Draggable component for schema tools (from LeftSidebar)
const Draggable = (props: {
  plugin: Plugin<Schema>;
  scale: number;
  basePdf: BasePdf;
  children: React.ReactNode;
}) => {
  const { scale, basePdf, plugin } = props;
  const { token } = theme.useToken();
  const options = useContext(OptionsContext);
  const defaultSchema = plugin.propPanel.defaultSchema;
  if (options.font) {
    const fontName = getFallbackFontName(options.font);
    setFontNameRecursively(defaultSchema, fontName);
  }

  const draggable = useDraggable({ id: defaultSchema.type, data: defaultSchema });
  const { listeners, setNodeRef, attributes, transform, isDragging } = draggable;
  const style = { transform: CSS.Translate.toString(transform) };

  const renderedSchema = React.useMemo(
    () => (
      <div style={{ transform: `scale(${scale})` }}>
        <Renderer
          schema={{ ...defaultSchema, id: defaultSchema.type }}
          basePdf={basePdf}
          value={defaultSchema.content || ''}
          onChangeHoveringSchemaId={() => {
            void 0;
          }}
          mode={'viewer'}
          outline={`1px solid ${token.colorPrimary}`}
          scale={scale}
        />
      </div>
    ),
    [defaultSchema, basePdf, scale, token.colorPrimary],
  );

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {isDragging && renderedSchema}
      <div style={{ visibility: isDragging ? 'hidden' : 'visible' }}>{props.children}</div>
    </div>
  );
};

// Field Palette Tab component
const FieldPaletteTab = ({
  scale,
  basePdf,
  setIsDragging,
}: {
  scale: number;
  basePdf: BasePdf;
  setIsDragging: (isDragging: boolean) => void;
}) => {
  const pluginsRegistry = useContext(PluginsRegistry);

  const handleFieldDragStart = (pluginType: string) => {
    setIsDragging(true);
  };

  return (
    <FieldPalette
      pluginsRegistry={pluginsRegistry}
      onFieldDragStart={handleFieldDragStart}
    />
  );
};

// Properties Tab component (vertical scrollable)
const PropertiesTab = (props: UnifiedSidebarProps) => {
  const { activeElements, schemas, currentSignerId, multiSignatureEnabled } = props;
  const { token } = theme.useToken();

  // Filter schemas based on current signer when multi-signature is enabled
  const filteredSchemas = React.useMemo(() => {
    if (!multiSignatureEnabled || !currentSignerId) {
      return schemas;
    }
    // Only show schemas assigned to the current signer or unassigned schemas
    return schemas.filter(schema =>
      schema.signerId === currentSignerId || !schema.signerId
    );
  }, [schemas, currentSignerId, multiSignatureEnabled]);

  const getActiveSchemas = () =>
    filteredSchemas.filter((s) => activeElements.map((ae) => ae.id).includes(s.id));
  const getLastActiveSchema = () => {
    const activeSchemas = getActiveSchemas();
    return activeSchemas[activeSchemas.length - 1];
  };

  // Create props with filtered schemas for ListView and DetailView
  const sidebarProps = {
    ...props,
    schemas: filteredSchemas, // Use filtered schemas
    sidebarOpen: true,
    setSidebarOpen: () => { }, // No-op function since sidebar is always open
  };

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        background: token.colorBgLayout,
        padding: '0.7rem 1rem',
        overflowY: 'auto',
        fontFamily: "'Open Sans', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {getActiveSchemas().length === 0 ? (
        <ListView {...sidebarProps} />
      ) : (
        <DetailView {...sidebarProps} activeSchema={getLastActiveSchema()} />
      )}
    </div>
  );
};

// Extended props interface for UnifiedSidebar
interface UnifiedSidebarProps extends Omit<SidebarProps, 'sidebarOpen' | 'setSidebarOpen'> {
  scale: number;
  basePdf: BasePdf;
}

const UnifiedSidebar = (props: UnifiedSidebarProps) => {
  const { scale, basePdf } = props;
  const { token } = theme.useToken();
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('fields');

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        width: '100%',
        overflow: isDragging ? 'visible' : 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: token.colorBgLayout,
          boxSizing: 'border-box',
        }}
      >
        {/* DocuSign-style Tabbed Interface */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          tabBarStyle={{
            margin: 0,
            padding: '0 16px',
            borderBottom: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
            backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100,
          }}
        >
          <TabPane tab="Fields" key="fields">
            <FieldPaletteTab
              scale={scale}
              basePdf={basePdf}
              setIsDragging={setIsDragging}
            />
          </TabPane>

          <TabPane tab="Properties" key="properties">
            <PropertiesTab {...props} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedSidebar;
