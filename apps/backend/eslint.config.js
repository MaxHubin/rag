import baseConfig from '@fathym/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
    {
        extends: [baseConfig]
    }

)
