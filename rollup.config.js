import path from 'path';
import babel from 'rollup-plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'typescript';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import typescript2 from 'rollup-plugin-typescript2';
import rollupResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';

const extensions = ['.js', '.ts'];

const external = Object.keys(pkg.dependencies || '');
const globals = external.reduce((prev, current) => {
  const newPrev = prev;
  newPrev[current] = current;
  return newPrev;
}, {});

const defaultConfig = {
  input: pkg.main,
  output: {
    file: path.resolve(__dirname, pkg.lib),
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    globals
  },
  external,
  plugins: [
    typescript2({
      exclude: 'node_modules/**',
      useTsconfigDeclarationDir: true,
      typescript,
      tsconfig: './tsconfig.json'
    }),
    json(),
    terser(),
    rollupResolve({
      // 查找和打包node_modules中的第三方模块
      customResolveOptions: {
        moduleDirectory: 'src'
      },
      preferBuiltins: true
    }),
    nodeResolve({
      extensions,
      modulesOnly: true
    }),
    babel({
      exclude: 'node_modules/**',
      extensions
    }),
    copy({
      targets: [
        {
          src: ['templates/vue-lite/*', '!templates/vue-lite/node_modules'],
          dest: 'bin/templates/vue-lite'
        },
        {
          src: ['templates/vue-next-lite/*', '!templates/vue-next-lite/node_modules'],
          dest: 'bin/templates/vue-next-lite'
        },
        {
          src: ['templates/react-lite/*', '!templates/react-lite/node_modules'],
          dest: 'bin/templates/react-lite'
        }
      ],
      verbose: true
    })
  ]
};

export default defaultConfig;
