<?php
/*
Plugin Name: Donation Plugin
Plugin URI: http://localhost/wpMas/
Description: Donation Plugin.
Version: 1.0
Author: Webary
Author URI: http://localhost/wpMas/
*/


include_once plugin_dir_path(__FILE__) . 'includes/custom-page-template.php';



add_action('wp_enqueue_scripts', 'my_custom_plugin_enqueue_scripts');

function my_custom_plugin_shortcode($atts)
{

    $atts = shortcode_atts(array('param' => 'default'), $atts, 'my_custom_plugin');
    ob_start();
    $param_value = isset($_GET['campaign']) ? $_GET['campaign'] : $atts['campaign'];
    dynamic_content_function($param_value);
    return ob_get_clean();
}
add_shortcode('my_custom_plugin', 'my_custom_plugin_shortcode');

function my_custom_plugin_activation()
{
    if (null === get_page_by_path('donation-content')) {
        $page = array(
            'post_title'     => 'Donation Content',
            'post_content'   => '[my_custom_plugin]', // The shortcode
            'post_status'    => 'publish',
            'post_author'    => get_current_user_id(),
            'post_type'      => 'page',
            'post_name'      => 'donation-content'
        );

        $page_id = wp_insert_post($page);

        update_option('my_custom_plugin_page_id', $page_id);
    }

    if (null === get_page_by_path('thank-you')) {
        $thank_you_page = array(
            'post_title'     => 'Thank You',
            'post_content'   => '',
            'post_status'    => 'publish',
            'post_author'    => get_current_user_id(),
            'post_type'      => 'page',
            'post_name'      => 'thank-you'
        );

        $thank_you_page_id = wp_insert_post($thank_you_page);

        update_option('my_custom_plugin_thank_you_page_id', $thank_you_page_id);
    }
}
register_activation_hook(__FILE__, 'my_custom_plugin_activation');

function my_custom_plugin_template_redirect()
{
    $page_id = get_option('my_custom_plugin_page_id');
    if (is_page($page_id)) {
        echo do_shortcode('[my_custom_plugin]');
        exit;
    }
}
add_action('template_redirect', 'my_custom_plugin_template_redirect');
// Deactivation Hook
function my_custom_plugin_deactivation()
{
    // Find and delete the page
    $page = get_page_by_path('donation-content');
    if ($page) {
        wp_delete_post($page->ID, true);
    }
}
register_deactivation_hook(__FILE__, 'my_custom_plugin_deactivation');


function my_custom_plugin_thank_you_content($content)
{
    // Check if we're on the 'thank-you' page
    $thank_you_page_id = get_option('my_custom_plugin_thank_you_page_id');
    if (is_page($thank_you_page_id)) {
        $transaction_id = isset($_GET['trans']) ? sanitize_text_field($_GET['trans']) : '';

        if (!empty($transaction_id)) {
            $dynamic_content = my_custom_plugin_get_dynamic_content($transaction_id);
            $content = $dynamic_content . $content;
        } else {
            $content = 'Thank you for your donation.' . $content;
        }
    }

    return $content;
}
add_filter('the_content', 'my_custom_plugin_thank_you_content');

function my_custom_plugin_get_dynamic_content($transaction_id)
{

    $external_url = 'http://localhost/cchf/thank-you/?trans=' . $transaction_id;

    $response = wp_remote_get($external_url);

    if (is_wp_error($response)) {
        return 'Failed to load content.';
    }

    $body = wp_remote_retrieve_body($response);
    return $body;
}


function my_custom_plugin_enqueue_scripts()
{
    wp_enqueue_script('my-script-handle', plugins_url('js/main.js', __FILE__));
}

add_action('wp_enqueue_scripts', 'my_custom_plugin_enqueue_scripts');
