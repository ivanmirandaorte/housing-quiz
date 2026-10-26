<?php

/**
 * Plugin Name: Housing Eligibility Quiz
 * Description: An interactive Housing eligibility screening tool. Use shortcode [housing_quiz] to display.
 * Version: 1.0.0
 * Author: ahfweb
 * License: GPL v2 or later
 * Text Domain: housing-quiz
 * Domain Path: /languages
 * Requires: 5.0
 * Requires PHP: 7.4
 */

// Exit if accessed directly
if (! defined('ABSPATH')) {
    exit;
}

// Define plugin constants
if (! defined('HOUSING_QUIZ_VERSION')) {
    define('HOUSING_QUIZ_VERSION', '1.0.0');
}
if (! defined('HOUSING_QUIZ_PATH')) {
    define('HOUSING_QUIZ_PATH', plugin_dir_path(__FILE__));
}
if (! defined('HOUSING_QUIZ_URL')) {
    define('HOUSING_QUIZ_URL', plugin_dir_url(__FILE__));
}

// Security: Prevent direct file access
if (! function_exists('add_action')) {
    exit('No direct access allowed');
}

/**
 * Enqueue plugin scripts and styles
 */
function housing_quiz_enqueue_assets()
{
    // Enqueue CSS with version cache busting
    wp_enqueue_style(
        'housing-quiz-style',
        HOUSING_QUIZ_URL . 'assets/css/housing-quiz.css',
        array(),
        HOUSING_QUIZ_VERSION
    );

    // Enqueue JS with version cache busting
    wp_enqueue_script(
        'housing-quiz-script',
        HOUSING_QUIZ_URL . 'assets/js/housing-quiz.js',
        array(),
        HOUSING_QUIZ_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'housing_quiz_enqueue_assets');

/**
 * Register the [housing_quiz] shortcode
 */
function housing_quiz_shortcode()
{
    // Return empty if user doesn't have permission to view
    if (! is_user_logged_in() && ! current_user_can('read')) {
        // Allow anonymous users for public quiz
        // For restricted access, check permissions here
    }

    ob_start();
?>

    <div id="housing-quiz" role="main" aria-label="Housing Eligibility Quiz">

        <div class="pq-progress" role="progressbar" aria-label="Quiz progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
            <div class="pq-progress-fill" id="pq-prog-fill" style="width:0%"></div>
        </div>

        <!-- ── QUESTION ── -->
        <div class="pq-screen" id="pq-question">
            <div class="pq-q-header">
                <div class="pq-q-num" id="pq-num" aria-hidden="true">1</div>
                <p class="pq-q-text" id="pq-text"></p>
            </div>
            <div class="pq-options" id="pq-opts" role="radiogroup" aria-label="Select an answer"></div>
            <div class="pq-btn-row">
                <div class="pq-btn-controls">
                    <button class="pq-btn-back" id="pq-btn-back" aria-label="Go to previous question">← Back</button>
                    <button class="pq-btn-ok" id="pq-btn-ok" disabled aria-label="Confirm answer">OK</button>
                </div>
                <!-- <div class="pq-kbd-hint" aria-hidden="true">
                    <span class="pq-kbd">A</span>
                    <span class="pq-kbd">B</span>
                    <span class="pq-kbd">C</span>
                    <span class="pq-hint-text">to select &nbsp;&bull;&nbsp;</span>
                    <span class="pq-kbd">Enter</span>
                    <span class="pq-hint-text">to confirm</span>
                </div> -->
            </div>
        </div>

        <!-- ── RESULT ── -->
        <div class="pq-screen" id="pq-result">
            <span class="pq-result-tag">Your Result</span>
            <div class="pq-result-body" id="pq-res-body"></div>
            <div class="pq-result-actions">
                <a class="pq-btn-primary" id="pq-btn-apply" href="#" hidden>Begin Application</a>
                <button class="pq-btn-primary" id="pq-btn-retake">Retake Quiz</button>
            </div>
        </div>

    </div><!-- #housing-quiz -->

<?php
    return ob_get_clean();
}
add_shortcode('housing_quiz', 'housing_quiz_shortcode');

/**
 * Add security headers
 */
function housing_quiz_security_headers()
{
    if (! is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
    }
}
add_action('send_headers', 'housing_quiz_security_headers');

/**
 * Plugin activation hook
 */
function housing_quiz_activate()
{
    // Log activation for debugging
    error_log('Housing Quiz Plugin activated on ' . current_time('mysql'));
}
register_activation_hook(__FILE__, 'housing_quiz_activate');

/**
 * Plugin deactivation hook
 */
function housing_quiz_deactivate()
{
    // Cleanup if needed
    error_log('Housing Quiz Plugin deactivated on ' . current_time('mysql'));
}
register_deactivation_hook(__FILE__, 'housing_quiz_deactivate');
