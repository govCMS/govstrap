<?php

/**
 * @file
 * alter.inc
 */

/**
 * Implements hook_css_alter().
 */
function govstrap_css_alter(&$css) {
  $theme_path = drupal_get_path('theme', 'govstrap');

  // Add bootstrap style file.
  $bootstrap = $theme_path . '/css/govstrap-bootstrap.css';
  $css[$bootstrap] = array(
    'data' => $bootstrap,
    'type' => 'file',
    'every_page' => TRUE,
    'media' => 'all',
    'preprocess' => TRUE,
    'group' => CSS_THEME,
    'browsers' => array('IE' => TRUE, '!IE' => TRUE),
    'weight' => -1,
  );

  // Exclude css
  if (!empty($excludes)) {
    $css = array_diff_key($css, drupal_map_assoc($excludes));
  }
}

/**
 * Implements hook_js_alter().
 */
function govstrap_js_alter(&$js) {
  $theme_path = drupal_get_path('theme', 'govstrap');

  // Ensure jQuery Once is always loaded.
  // @see https://drupal.org/node/2149561
  if (empty($js['misc/jquery.once.js'])) {
    $jquery_once = drupal_get_library('system', 'jquery.once');
    $js['misc/jquery.once.js'] = $jquery_once['js']['misc/jquery.once.js'];
    $js['misc/jquery.once.js'] += drupal_js_defaults('misc/jquery.once.js');
  }

  // Load bootstrap js
  $bootstrap = $theme_path . '/js/bootstrap.js';
  $js[$bootstrap] = drupal_js_defaults($bootstrap);
  $js[$bootstrap]['group'] = JS_THEME;
  $js[$bootstrap]['scope'] = 'footer';

  // Exclude js
  if (!empty($excludes)) {
    $js = array_diff_key($js, drupal_map_assoc($excludes));
  }
}

/**
 * Implements hook_js_callback_filter_xss_alter().
 */
function govstrap_js_callback_filter_xss_alter(array &$allowed_tags = array()) {
  $allowed_tags[] = 'button';
}
