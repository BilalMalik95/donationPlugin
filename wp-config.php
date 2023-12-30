<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wpmasbia' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'ol<`B9p_}LWADc>74]pd&_y&@`A9Wp8c;1L064hD=pd61^)}qaKEl@ZtKR5/F.<?' );
define( 'SECURE_AUTH_KEY',  '6#%im>H XEyR_AzVP!=GHX#Kf~CQo->kCL=}]E:gX+/8>Ug(pKmA99y,s{#r+gEl' );
define( 'LOGGED_IN_KEY',    'S]},j O_BSY&Okq/f=pA-,?Lw4mjZ5NE{BO&=V]G)F%?&:k?:@!.aVvZ5Qzc{JCx' );
define( 'NONCE_KEY',        '_`-wf,^-t:;{NZ:aD?71AzP.lwwe^^;z*uKdH^h;wd!_oGDsqT`T!Rb0SMIyd)u~' );
define( 'AUTH_SALT',        '0] 8a>tV38vXO,+ma%gZB n_SL?])wJ] 20maF2EB:-zDc6M|OgIS1 4`$ /hzR:' );
define( 'SECURE_AUTH_SALT', '%R^)=-A$.#5Co4_l)ORd]LFS5zVuW|ETgZ08$*%3Ys7SzAF#MM_x|tm=>r-dHC-m' );
define( 'LOGGED_IN_SALT',   'W#e?u+2^o<m- @GbmXSP2SeD+^jvMDz,cpX?FG&]<0(g75nS#Qn@#wmVX8Ws3<FC' );
define( 'NONCE_SALT',       'I>Ny(5@qe5H}?(JFD8?ul>0gd3b[6EM.W1}JX-q:v2^8V_)R3gLqkYRj*ORi2O[V' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_mas';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
