import React from 'react';
import { Steps, Button, Space, Typography, Progress } from 'antd';
import {
    FileTextOutlined,
    UserAddOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    SaveOutlined,
    SendOutlined
} from '@ant-design/icons';
import { DOCUSIGN_COLORS } from '../constants';

const { Step } = Steps;
const { Text } = Typography;

export type WorkflowStage = 'prepare' | 'assign' | 'sign' | 'review';

interface WorkflowStepperProps {
    currentStage: WorkflowStage;
    completedStages: WorkflowStage[];
    onStageChange: (stage: WorkflowStage) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    onSave?: () => void;
    onSend?: () => void;
    canProceed?: boolean;
    isLoading?: boolean;
    totalFields?: number;
    assignedFields?: number;
    completedFields?: number;
}

const workflowSteps = [
    {
        key: 'prepare' as WorkflowStage,
        title: 'Prepare',
        description: 'Upload document and place fields',
        icon: <FileTextOutlined />,
    },
    {
        key: 'assign' as WorkflowStage,
        title: 'Assign',
        description: 'Assign fields to signers',
        icon: <UserAddOutlined />,
    },
    {
        key: 'sign' as WorkflowStage,
        title: 'Sign',
        description: 'Collect signatures',
        icon: <EditOutlined />,
    },
    {
        key: 'review' as WorkflowStage,
        title: 'Complete',
        description: 'Review and finalize',
        icon: <CheckCircleOutlined />,
    },
];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
    currentStage,
    completedStages,
    onStageChange,
    onNext,
    onPrevious,
    onSave,
    onSend,
    canProceed = true,
    isLoading = false,
    totalFields = 0,
    assignedFields = 0,
    completedFields = 0,
}) => {
    const currentStepIndex = workflowSteps.findIndex(step => step.key === currentStage);

    const getStepStatus = (stepKey: WorkflowStage) => {
        if (completedStages.includes(stepKey)) return 'finish';
        if (stepKey === currentStage) return 'process';
        return 'wait';
    };

    const getProgressInfo = () => {
        switch (currentStage) {
            case 'prepare':
                return {
                    label: 'Fields placed',
                    current: totalFields,
                    total: totalFields,
                    percent: totalFields > 0 ? 100 : 0,
                };
            case 'assign':
                return {
                    label: 'Fields assigned',
                    current: assignedFields,
                    total: totalFields,
                    percent: totalFields > 0 ? (assignedFields / totalFields) * 100 : 0,
                };
            case 'sign':
                return {
                    label: 'Fields completed',
                    current: completedFields,
                    total: totalFields,
                    percent: totalFields > 0 ? (completedFields / totalFields) * 100 : 0,
                };
            case 'review':
                return {
                    label: 'Document complete',
                    current: totalFields,
                    total: totalFields,
                    percent: 100,
                };
            default:
                return { label: '', current: 0, total: 0, percent: 0 };
        }
    };

    const progressInfo = getProgressInfo();

    const getStageActions = () => {
        switch (currentStage) {
            case 'prepare':
                return (
                    <Space>
                        {onSave && (
                            <Button
                                icon={<SaveOutlined />}
                                onClick={onSave}
                                loading={isLoading}
                            >
                                Save Template
                            </Button>
                        )}
                        {onNext && (
                            <Button
                                type="primary"
                                icon={<ArrowRightOutlined />}
                                onClick={onNext}
                                disabled={!canProceed || totalFields === 0}
                                loading={isLoading}
                            >
                                Assign Fields
                            </Button>
                        )}
                    </Space>
                );

            case 'assign':
                return (
                    <Space>
                        {onPrevious && (
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={onPrevious}
                                loading={isLoading}
                            >
                                Back to Prepare
                            </Button>
                        )}
                        {onSave && (
                            <Button
                                icon={<SaveOutlined />}
                                onClick={onSave}
                                loading={isLoading}
                            >
                                Save Draft
                            </Button>
                        )}
                        {onSend && (
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={onSend}
                                disabled={!canProceed || assignedFields < totalFields}
                                loading={isLoading}
                            >
                                Send for Signature
                            </Button>
                        )}
                    </Space>
                );

            case 'sign':
                return (
                    <Space>
                        {onNext && (
                            <Button
                                type="primary"
                                icon={<ArrowRightOutlined />}
                                onClick={onNext}
                                disabled={!canProceed || completedFields < totalFields}
                                loading={isLoading}
                            >
                                Review & Complete
                            </Button>
                        )}
                    </Space>
                );

            case 'review':
                return (
                    <Space>
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            disabled={!canProceed}
                            loading={isLoading}
                        >
                            Download Signed Document
                        </Button>
                    </Space>
                );

            default:
                return null;
        }
    };

    const getStageGuidance = () => {
        switch (currentStage) {
            case 'prepare':
                return 'Upload your document and drag fields from the sidebar to place them on the document.';
            case 'assign':
                return 'Assign each field to a signer and set the signing order. All fields must be assigned before sending.';
            case 'sign':
                return 'Signers will receive email notifications to complete their assigned fields in order.';
            case 'review':
                return 'All signatures have been collected. Review the completed document and download the final version.';
            default:
                return '';
        }
    };

    return (
        <div style={{
            padding: '16px 24px',
            borderBottom: `1px solid ${DOCUSIGN_COLORS.NEUTRAL_200}`,
            backgroundColor: DOCUSIGN_COLORS.NEUTRAL_100,
        }}>
            {/* Progress Steps */}
            <Steps
                current={currentStepIndex}
                size="small"
                style={{ marginBottom: 16 }}
            >
                {workflowSteps.map((step) => (
                    <Step
                        key={step.key}
                        title={step.title}
                        description={step.description}
                        icon={step.icon}
                        status={getStepStatus(step.key)}
                        onClick={() => onStageChange(step.key)}
                        style={{ cursor: 'pointer' }}
                    />
                ))}
            </Steps>

            {/* Progress Bar and Info */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
            }}>
                <div style={{ flex: 1, marginRight: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={{ fontSize: 12, color: DOCUSIGN_COLORS.NEUTRAL_600 }}>
                            {progressInfo.label}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 600 }}>
                            {progressInfo.current} / {progressInfo.total}
                        </Text>
                    </div>
                    <Progress
                        percent={progressInfo.percent}
                        size="small"
                        strokeColor={DOCUSIGN_COLORS.PRIMARY}
                        showInfo={false}
                    />
                </div>

                {/* Stage Actions */}
                {getStageActions()}
            </div>

            {/* Stage Guidance */}
            <Text style={{
                fontSize: 12,
                color: DOCUSIGN_COLORS.NEUTRAL_600,
                fontStyle: 'italic',
            }}>
                {getStageGuidance()}
            </Text>
        </div>
    );
};

export default WorkflowStepper;