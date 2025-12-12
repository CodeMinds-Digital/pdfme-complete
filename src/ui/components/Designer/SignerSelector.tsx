import React, { useState, useContext, useCallback } from 'react';
import { Select, Button, Input, Modal, ColorPicker, Space, Typography, Popconfirm, theme, Radio, InputNumber, Divider, Badge } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined, ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Signer } from '../../../common';
import { I18nContext } from '../../contexts';
import { DOCUSIGN_COLORS } from '../../constants';

const { Option } = Select;
const { Text } = Typography;

interface SignerSelectorProps {
  signers: Signer[];
  currentSignerId: string | null;
  onSignerChange: (signerId: string | null) => void;
  onSignersUpdate: (signers: Signer[]) => void;
  signingOrder?: 'sequential' | 'parallel';
  onSigningOrderChange?: (order: 'sequential' | 'parallel') => void;
}

const DEFAULT_SIGNER_COLORS = [
  '#1890ff', // Blue
  '#52c41a', // Green  
  '#fa8c16', // Orange
  '#eb2f96', // Pink
  '#722ed1', // Purple
  '#13c2c2', // Cyan
  '#f5222d', // Red
  '#faad14', // Gold
];

const SignerSelector: React.FC<SignerSelectorProps> = ({
  signers,
  currentSignerId,
  onSignerChange,
  onSignersUpdate,
  signingOrder = 'sequential',
  onSigningOrderChange,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSigner, setEditingSigner] = useState<Signer | null>(null);
  const [signerForm, setSignerForm] = useState({
    name: '',
    email: '',
    role: 'signer',
    color: DEFAULT_SIGNER_COLORS[0],
    order: 1,
    status: 'not_started' as const,
  });

  const i18n = useContext(I18nContext);
  const { token } = theme.useToken();

  const generateSignerId = useCallback(() => {
    const existingNumbers = signers.map(s => {
      const match = s.id.match(/^signer_(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });
    const nextNumber = Math.max(0, ...existingNumbers) + 1;
    return `signer_${nextNumber}`;
  }, [signers]);

  const getNextSignerColor = useCallback(() => {
    const usedColors = signers.map(s => s.color);
    return DEFAULT_SIGNER_COLORS.find(color => !usedColors.includes(color)) || DEFAULT_SIGNER_COLORS[0];
  }, [signers]);

  const handleAddSigner = useCallback(() => {
    const newSignerId = generateSignerId();
    const signerNumber = newSignerId.replace('signer_', '');
    const maxOrder = Math.max(0, ...signers.map(s => (s as any).order || 0));
    const newSigner: Signer = {
      id: newSignerId,
      name: signerForm.name || `Signer ${signerNumber}`,
      email: signerForm.email,
      role: signerForm.role,
      color: signerForm.color,
      order: maxOrder + 1,
      status: 'not_started',
    } as any;

    const updatedSigners = [...signers, newSigner];
    onSignersUpdate(updatedSigners);

    // Auto-select the new signer
    onSignerChange(newSigner.id);

    // Reset form
    setSignerForm({
      name: '',
      email: '',
      role: 'signer',
      color: getNextSignerColor(),
      order: maxOrder + 2,
      status: 'not_started',
    });
    setIsModalVisible(false);
  }, [generateSignerId, signerForm, signers, onSignersUpdate, onSignerChange, getNextSignerColor]);

  const handleEditSigner = (signer: Signer) => {
    setEditingSigner(signer);
    setSignerForm({
      name: signer.name,
      email: signer.email || '',
      role: signer.role || 'signer',
      color: signer.color || DEFAULT_SIGNER_COLORS[0],
      order: (signer as any).order || 1,
      status: (signer as any).status || 'not_started',
    });
    setIsModalVisible(true);
  };

  const handleUpdateSigner = () => {
    if (!editingSigner) return;

    const updatedSigners = signers.map(signer =>
      signer.id === editingSigner.id
        ? {
          ...signer,
          name: signerForm.name || signer.name,
          email: signerForm.email,
          role: signerForm.role,
          color: signerForm.color,
          order: signerForm.order,
          status: signerForm.status,
        }
        : signer
    );

    onSignersUpdate(updatedSigners);
    setEditingSigner(null);
    setIsModalVisible(false);
  };

  const handleDeleteSigner = useCallback((signerId: string) => {
    // Don't allow deleting the last signer
    if (signers.length <= 1) return;

    const updatedSigners = signers.filter(signer => signer.id !== signerId);
    onSignersUpdate(updatedSigners);

    // If we deleted the current signer, select the first remaining one
    if (currentSignerId === signerId) {
      onSignerChange(updatedSigners[0]?.id || null);
    }
  }, [signers, onSignersUpdate, currentSignerId, onSignerChange]);

  const openAddModal = () => {
    setEditingSigner(null);
    const maxOrder = Math.max(0, ...signers.map(s => (s as any).order || 0));
    setSignerForm({
      name: '',
      email: '',
      role: 'signer',
      color: getNextSignerColor(),
      order: maxOrder + 1,
      status: 'not_started',
    });
    setIsModalVisible(true);
  };

  const moveSignerOrder = (signerId: string, direction: 'up' | 'down') => {
    const signer = signers.find(s => s.id === signerId) as any;
    if (!signer) return;

    const currentOrder = signer.order || 1;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

    // Find signer with target order
    const targetSigner = signers.find(s => (s as any).order === targetOrder) as any;
    if (!targetSigner) return;

    const updatedSigners = signers.map(s => {
      const signerAny = s as any;
      if (s.id === signerId) {
        return { ...s, order: targetOrder };
      }
      if (s.id === targetSigner.id) {
        return { ...s, order: currentOrder };
      }
      return s;
    });

    onSignersUpdate(updatedSigners);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: DOCUSIGN_COLORS.SUCCESS }} />;
      case 'in_progress':
        return <ClockCircleOutlined style={{ color: DOCUSIGN_COLORS.WARNING }} />;
      default:
        return <ClockCircleOutlined style={{ color: DOCUSIGN_COLORS.NEUTRAL_400 }} />;
    }
  };

  // Sort signers by order
  const sortedSigners = [...signers].sort((a, b) => ((a as any).order || 1) - ((b as any).order || 1));

  // Initialize with default signer if none exist
  React.useEffect(() => {
    if (signers.length === 0) {
      const defaultSigner: Signer = {
        id: 'signer_1',
        name: 'Signer 1',
        email: '',
        role: '',
        color: DEFAULT_SIGNER_COLORS[0],
      };
      onSignersUpdate([defaultSigner]);
      onSignerChange(defaultSigner.id);
    }
  }, [signers.length]); // Removed onSignersUpdate and onSignerChange to prevent loops

  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: `1px solid ${token.colorBorder}`,
      background: token.colorBgContainer,
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '12px' }}>
        <Space>
          <UserOutlined style={{ color: token.colorTextSecondary }} />
          <Text strong style={{ color: token.colorText }}>Signers</Text>
          <Badge count={signers.length} style={{ backgroundColor: DOCUSIGN_COLORS.PRIMARY }} />
        </Space>
      </div>

      {/* Signing Order Controls */}
      {onSigningOrderChange && (
        <div style={{ marginBottom: '12px' }}>
          <Text style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 4, display: 'block' }}>
            Signing Order
          </Text>
          <Radio.Group
            value={signingOrder}
            onChange={(e) => onSigningOrderChange(e.target.value)}
            size="small"
          >
            <Radio.Button value="sequential">Sequential</Radio.Button>
            <Radio.Button value="parallel">Parallel</Radio.Button>
          </Radio.Group>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Select
          style={{ flex: 1, minWidth: '150px' }}
          placeholder="Select signer"
          value={currentSignerId}
          onChange={onSignerChange}
          popupRender={(menu) => (
            <>
              {menu}
              <div style={{
                padding: '8px',
                borderTop: `1px solid ${token.colorBorder}`,
                background: token.colorBgContainer
              }}>
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={openAddModal}
                  style={{
                    width: '100%',
                    color: token.colorPrimary,
                    borderColor: token.colorBorder
                  }}
                >
                  Add New Signer
                </Button>
              </div>
            </>
          )}
        >
          {sortedSigners.map((signer) => {
            const signerAny = signer as any;
            return (
              <Option key={signer.id} value={signer.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: signer.color,
                      border: `1px solid ${token.colorBorder}`,
                    }}
                  />
                  {signingOrder === 'sequential' && (
                    <Badge
                      count={signerAny.order || 1}
                      size="small"
                      style={{ backgroundColor: DOCUSIGN_COLORS.NEUTRAL_500 }}
                    />
                  )}
                  <span>{signer.name}</span>
                  {signer.role && <Text type="secondary">({signer.role})</Text>}
                  {getStatusIcon(signerAny.status)}
                </div>
              </Option>
            );
          })}
        </Select>

        {currentSignerId && (
          <Space>
            {signingOrder === 'sequential' && (
              <>
                <Button
                  type="text"
                  icon={<ArrowUpOutlined />}
                  size="small"
                  onClick={() => moveSignerOrder(currentSignerId, 'up')}
                  disabled={((signers.find(s => s.id === currentSignerId) as any)?.order || 1) <= 1}
                />
                <Button
                  type="text"
                  icon={<ArrowDownOutlined />}
                  size="small"
                  onClick={() => moveSignerOrder(currentSignerId, 'down')}
                  disabled={((signers.find(s => s.id === currentSignerId) as any)?.order || 1) >= signers.length}
                />
              </>
            )}
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                const signer = signers.find(s => s.id === currentSignerId);
                if (signer) handleEditSigner(signer);
              }}
            />
            {signers.length > 1 && (
              <Popconfirm
                title="Delete this signer?"
                description="All fields assigned to this signer will be removed."
                onConfirm={() => handleDeleteSigner(currentSignerId)}
                okText="Delete"
                cancelText="Cancel"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                />
              </Popconfirm>
            )}
          </Space>
        )}
      </div>

      <Modal
        title={editingSigner ? 'Edit Signer' : 'Add New Signer'}
        open={isModalVisible}
        onOk={editingSigner ? handleUpdateSigner : handleAddSigner}
        onCancel={() => setIsModalVisible(false)}
        okText={editingSigner ? 'Update' : 'Add'}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>Name *</Text>
            <Input
              placeholder="Enter signer name"
              value={signerForm.name}
              onChange={(e) => setSignerForm({ ...signerForm, name: e.target.value })}
            />
          </div>

          <div>
            <Text>Email</Text>
            <Input
              placeholder="Enter email address"
              value={signerForm.email}
              onChange={(e) => setSignerForm({ ...signerForm, email: e.target.value })}
            />
          </div>

          <div>
            <Text>Role</Text>
            <Select
              style={{ width: '100%' }}
              value={signerForm.role}
              onChange={(value) => setSignerForm({ ...signerForm, role: value })}
            >
              <Option value="signer">Signer</Option>
              <Option value="approver">Approver</Option>
              <Option value="cc">CC (Copy)</Option>
              <Option value="witness">Witness</Option>
            </Select>
          </div>

          {signingOrder === 'sequential' && (
            <div>
              <Text>Signing Order</Text>
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={signers.length + 1}
                value={signerForm.order}
                onChange={(value) => setSignerForm({ ...signerForm, order: value || 1 })}
              />
            </div>
          )}

          <div>
            <Text>Status</Text>
            <Select
              style={{ width: '100%' }}
              value={signerForm.status}
              onChange={(value) => setSignerForm({ ...signerForm, status: value })}
            >
              <Option value="not_started">Not Started</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </div>

          <div>
            <Text>Color</Text>
            <div style={{ marginTop: '4px' }}>
              <ColorPicker
                value={signerForm.color}
                onChange={(color) => setSignerForm({ ...signerForm, color: color.toHexString() })}
                presets={[
                  {
                    label: 'Recommended',
                    colors: DEFAULT_SIGNER_COLORS,
                  },
                ]}
              />
            </div>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default React.memo(SignerSelector);
