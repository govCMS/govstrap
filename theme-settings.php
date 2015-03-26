<?php

/**
 * @file
 * theme-settings.php
 */

/**
 * Include theme common function.
 */
include_once './' . drupal_get_path('theme', 'govstrap') . '/includes/common.inc';

/**
 * Implements hook_form_system_theme_settings_alter().
 * @param $form
 * @param $form_state
 * @param null $form_id
 */
function govstrap_form_system_theme_settings_alter(&$form, $form_state, $form_id = NULL) {
  // @see https://drupal.org/node/943212
  $theme = !empty($form_state['build_info']['args'][0]) ? $form_state['build_info']['args'][0] : FALSE;
  if (isset($form_id) || $theme === FALSE || !in_array('govstrap', _govstrap_get_base_themes($theme, TRUE))) {
    return;
  }

  // Accessibility and support settings
  $form['support'] = array(
    '#type'          => 'fieldset',
    '#title'         => t('Accessibility and support settings'),
  );

  $form['support']['govstrap_skip_link_anchor'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Anchor ID for the “skip link”'),
    '#default_value' => theme_get_setting('govstrap_skip_link_anchor'),
    '#field_prefix'  => '#',
    '#description'   => t('Specify the HTML ID of the element that the accessible-but-hidden “skip link” should link to. Note: that element should have the <code>tabindex="-1"</code> attribute to prevent an accessibility bug in webkit browsers. (<a href="!link">Read more about skip links</a>.)', array('!link' => 'https://drupal.org/node/467976')),
  );

  $form['support']['govstrap_skip_link_text'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Text for the “skip link”'),
    '#default_value' => theme_get_setting('govstrap_skip_link_text'),
    '#description'   => t('For example: <em>Jump to navigation</em>, <em>Skip to content</em>'),
  );

  // Theme development settings
  $form['development'] = array(
    '#type' => 'fieldset',
    '#title' => t('Theme development settings'),
  );

  $form['development']['govstrap_rebuild_registry'] = array(
    '#type' => 'checkbox',
    '#title' => t('Rebuild theme registry on every page.'),
    '#default_value' => theme_get_setting('govstrap_rebuild_registry'),
    '#description' => t('During theme development, it can be very useful to continuously <a href="!link">rebuild the theme registry</a>. WARNING: this is a huge performance penalty and must be turned off on production websites.', array('!link' => 'https://drupal.org/node/173880#theme-registry')),
  );
}
