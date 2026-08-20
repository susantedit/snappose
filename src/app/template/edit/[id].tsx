/**
 * Template Edit Screen Route — /template/edit/[id]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SPTemplateEditor } from '@/features/templates/components/SPTemplateEditor';
import { TemplateService } from '@/features/templates/services/TemplateService';
import { useTemplateStore } from '@/features/templates/stores/templateStore';
import type { Template } from '@/features/templates/types';

export default function TemplateEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const templateStore = useTemplateStore();

  const template = id ? TemplateService.findById(id) : undefined;

  if (!template) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.errorText}>Template not found</Text>
      </View>
    );
  }

  const handleSave = (updated: Template) => {
    templateStore.saveUserCreatedTemplate(updated);
    router.replace({ pathname: '/template/[id]', params: { id: updated.id } });
  };

  return (
    <SPTemplateEditor
      initialTemplate={template}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
