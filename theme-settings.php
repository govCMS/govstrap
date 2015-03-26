<?php

/**
 * @file
 * theme-settings.php
 */

/**
 * Implements hook_form_system_theme_settings_alter().
 * @param $form
 * @param $form_state
 * @param null $form_id
 */
function govstrap_form_system_theme_settings_alter(&$form, $form_state, $form_id = NULL) {
  if (isset($form_id)) {
    return;
  }

  // Theme development settings
  $form['themedev'] = array(
    '#type' => 'fieldset',
    '#title' => t('Theme development settings'),
  );

  $form['themedev']['govstrap_rebuild_registry'] = array(
    '#type' => 'checkbox',
    '#title' => t('Rebuild theme registry on every page.'),
    '#default_value' => theme_get_setting('govstrap_rebuild_registry'),
    '#description' => t('During theme development, it can be very useful to continuously <a href="!link">rebuild the theme registry</a>. WARNING: this is a huge performance penalty and must be turned off on production websites.', array('!link' => 'https://drupal.org/node/173880#theme-registry')),
  );
}
