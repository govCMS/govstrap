<?php

/**
 * @file
 * preprocess.inc
 */

/**
 * Implements hook_preprocess_block().
 */
function govstrap_preprocess_block(&$variables, $hook) {
  // Use a template with no wrapper for the page's main content.
  if ($variables['block_html_id'] == 'block-system-main') {
    $variables['theme_hook_suggestions'][] = 'block__no_wrapper';
  }

  $variables['title_attributes_array']['class'][] = 'block-title';
}

/**
 * Implements hook_preprocess_html().
 * Override or insert variables into the html template.
 * @param $variables
 * @param $hook
 */
function govstrap_preprocess_html(&$variables, $hook) {
  // Set common variables.
  $variables['path_to_govstrap'] = drupal_get_path('theme', 'govstrap');

  // Send X-UA-Compatible HTTP header to force IE to use the most recent
  // rendering engine or use Chrome's frame rendering engine if available.
  if (is_null(drupal_get_http_header('X-UA-Compatible'))) {
    drupal_add_http_header('X-UA-Compatible', 'IE=edge,chrome=1');
  }

  // IE8 support of HTML5 elements and media queries.
  $ie_script_r = array(
    '#browsers' => array('IE' => 'lt IE 9', '!IE' => FALSE),
    '#tag' => 'script',
    '#attributes' => array(
      'type' => "text/javascript",
      'src' => './' . $variables['path_to_govstrap'] . '/js/respond.js',
    )
  );
  drupal_add_html_head($ie_script_r, "govstraprespond");

  // IE8 support of HTML5 elements and media queries .
  $ie_script_s = array(
    '#browsers' => array('IE' => 'lt IE 9', '!IE' => FALSE),
    '#tag' => 'script',
    '#attributes' => array(
      'type' => "text/javascript",
      'src' => './' . $variables['path_to_govstrap'] . '/js/html5shiv.js',

    )
  );
  drupal_add_html_head($ie_script_s, "govstrapshiv");

  // Accessibility settings.
  $variables['skip_link_anchor'] = check_plain(theme_get_setting('govstrap_skip_link_anchor'));
  $variables['skip_link_text'] = check_plain(theme_get_setting('govstrap_skip_link_text'));

  // Return early, so the maintenance page does not call any of the code below.
  if ($hook != 'html') {
    return;
  }
}

/**
 * Implements hook_preprocess_page().
 * @param $variables
 * @see page.tpl.php
 */
function govstrap_preprocess_page(&$variables) {
  // Set page container columns.
  $variables['container_class'] = 'container';

  // Calculate container columns with sidebar.
  if (!empty($variables['page']['sidebar_first']) && !empty($variables['page']['sidebar_second'])) {
    $variables['content_column_class'] = 'col-sm-6';
  }
  elseif (!empty($variables['page']['sidebar_first']) || !empty($variables['page']['sidebar_second'])) {
    $variables['content_column_class'] = 'col-sm-9';
  }
  else {
    $variables['content_column_class'] = 'col-sm-12';
  }
}
