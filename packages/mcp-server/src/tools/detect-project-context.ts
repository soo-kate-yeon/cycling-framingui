import type {
  DetectProjectContextInput,
  DetectProjectContextOutput,
} from '../schemas/mcp-schemas.js';
import { detectProjectContext } from '../project-context.js';
import { setActiveProjectContext } from '../project-context-state.js';

type DetectProjectContextToolInput = Pick<DetectProjectContextInput, 'projectPath'> &
  Partial<Pick<DetectProjectContextInput, 'setAsDefault'>>;

export async function detectProjectContextTool(
  input: DetectProjectContextToolInput
): Promise<DetectProjectContextOutput> {
  const result = detectProjectContext(input.projectPath);

  if (!result.success || !result.context) {
    return {
      success: false,
      error: result.error || 'Failed to detect project context',
    };
  }

  if (input.setAsDefault !== false) {
    setActiveProjectContext(result.context);
  }

  return {
    success: true,
    projectPath: result.context.projectPath,
    packageJsonPath: result.context.packageJsonPath,
    platform: result.context.platform,
    environment: result.context.environment,
    recommendations: [
      result.context.platform === 'react-native'
        ? {
            workflow: 'react-native-direct-write',
            reason:
              result.context.environment.runtime === 'expo'
                ? 'Expo project detected. Use React Native direct-write workflow by default.'
                : 'React Native project detected. Use native direct-write workflow by default.',
          }
        : {
            workflow: 'web-screen-definition',
            reason:
              'Web project detected. Use the validated Screen Definition workflow by default.',
          },
    ],
    sessionDefaultApplied: input.setAsDefault !== false,
  };
}
