// src/__tests__/UserCoursesList.spec.js

import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import UserCoursesList from '../components/UserCoursesList.vue';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify();

const stubs = {
  VCard: true, VCardTitle: true, VCardText: true, VBtn: true, VAlert: true,
  VCode: true, VContainer: true, VRow: true, VCol: true
};

const mockCourses = [
  { id: 1, title: 'Curso Mock 1' },
  { id: 2, title: 'Curso Mock 2' }
];

describe('UserCoursesList', () => {
  it('se monta correctamente y recibe la prop "courses"', () => {
    const wrapper = shallowMount(UserCoursesList, {
      props: {
        courses: mockCourses 
      },
      global: {
        plugins: [vuetify], 
        stubs: stubs, 
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});