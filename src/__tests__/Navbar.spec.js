// src/__tests__/Navbar.spec.js

import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Navbar from '../components/NavBar.vue';
import { createVuetify } from 'vuetify';


const vuetify = createVuetify();


const stubs = {
  
  VApp: true, VAppBar: true, VToolbarTitle: true, VBtn: true, VIcon: true, 
  VAlert: true, VCode: true, VContainer: true, VRow: true, VCol: true,

  
  RouterLink: { template: '<div><slot /></div>' }
};

describe('Navbar', () => {
  it('se monta correctamente y resuelve dependencias', () => {
    const wrapper = shallowMount(Navbar, {
      global: {
        plugins: [vuetify], 
        stubs: stubs, 
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});