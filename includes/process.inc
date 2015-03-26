<?php

/**
 * @file process.inc
 */

/**
 * Implements hook_process_block().
 */
function govstrap_process_block(&$variables, $hook) {
  // Drupal 7 should use a $title variable instead of $block->subject.
  $variables['title'] = isset($variables['block']->subject) ? $variables['block']->subject : '';
}
