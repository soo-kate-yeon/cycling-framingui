import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { describe, expect, it } from 'vitest';
import { Button, InlineMessage, Screen, Stack, TextField } from '../src/index.js';

describe('@framingui/react-native primitives', () => {
  it('renders a token-backed button label', () => {
    const tree = TestRenderer.create(<Button label="Continue" />);
    const textNode = tree.root.findByType(Text);

    expect(textNode.props.children).toBe('Continue');
  });

  it('renders text field label and message states', () => {
    const tree = TestRenderer.create(
      <TextField
        invalid={true}
        label="Email"
        message="Email is required"
        placeholder="name@example.com"
      />
    );

    const labelNode = tree.root.findAllByType(Text)[0];
    const inputNode = tree.root.findByType(TextInput);
    const messageNode = tree.root.findAllByType(Text)[1];

    expect(labelNode.props.children).toBe('Email');
    expect(inputNode.props.placeholder).toBe('name@example.com');
    expect(messageNode.props.children).toBe('Email is required');
  });

  it('renders inline messages inside stack layouts', () => {
    const tree = TestRenderer.create(
      <Stack gap={4}>
        <InlineMessage message="Check your input" tone="error" />
      </Stack>
    );

    const viewNode = tree.root.findByType(View);
    const textNode = tree.root.findByType(Text);

    expect(viewNode.props.style).toBeDefined();
    expect(textNode.props.children).toBe('Check your input');
  });

  it('switches between scroll and static screen containers', () => {
    const scrollTree = TestRenderer.create(
      <Screen width="narrow">
        <Text>Scrollable</Text>
      </Screen>
    );
    const staticTree = TestRenderer.create(
      <Screen scroll={false}>
        <Text>Static</Text>
      </Screen>
    );

    expect(scrollTree.root.findByType(ScrollView)).toBeTruthy();
    expect(staticTree.root.findAllByType(ScrollView)).toHaveLength(0);
    expect(staticTree.root.findByType(View)).toBeTruthy();
  });
});
