import React, { useState, useContext, useCallback } from 'react';
import { Select, Button, Input, Modal, ColorPicker, Space, Typography, Popconfirm, theme } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import type { Signer } from '../../../common';
import { I18nContext } from '../../contexts';

const { Option } = Select;
const { Text } = Typography;

interface SignerSelectorProps {
  signers: Signer[];
  currentSignerId: string | null;
  onSignerChange: (signerId: string | null) => void;
  onSignersUpdate: (signers: Signer[]) => void;
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
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSigner, setEditingSigner] = useState<Signer | null>(null);
  const [signerForm, setSignerForm] = useState({
    name: '',
    email: '',
    role: '',
    color: DEFAULT_SIGNER_COLORS[0],
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
    const newSigner: Signer = {
      id: newSignerId,
      name: signerForm.name || `Signer ${signerNumber}`,
      email: signerForm.email,
      role: signerForm.role,
      color: signerForm.color,
    };

    const updatedSigners = [...signers, newSigner];
    onSignersUpdate(updatedSigners);

    // Auto-select the new signer
    onSignerChange(newSigner.id);

    // Reset form
    setSignerForm({
      name: '',
      email: '',
      role: '',
      color: getNextSignerColor(),
    });
    setIsModalVisible(false);
  }, [generateSignerId, signerForm, signers, onSignersUpdate, onSignerChange, getNextSignerColor]);

  const handleEditSigner = (signer: Signer) => {
    setEditingSigner(signer);
    setSignerForm({
      name: signer.name,
      email: signer.email || '',
      role: signer.role || '',
      color: signer.color || DEFAULT_SIGNER_COLORS[0],
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
    setSignerForm({
      name: '',
      email: '',
      role: '',
      color: getNextSignerColor(),
    });
    setIsModalVisible(true);
  };

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
      <div style={{ marginBottom: '8px' }}>
        <Space>
          <UserOutlined style={{ color: token.colorTextSecondary }} />
          <Text strong style={{ color: token.colorText }}>Signers</Text>
        </Space>
      </div>

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
          {signers.map((signer) => (
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
                <span>{signer.name}</span>
                {signer.role && <Text type="secondary">({signer.role})</Text>}
              </div>
            </Option>
          ))}
        </Select>

        {currentSignerId && (
          <Space>
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
            <Input
              placeholder="e.g., Client, Manager, Witness"
              value={signerForm.role}
              onChange={(e) => setSignerForm({ ...signerForm, role: e.target.value })}
            />
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
