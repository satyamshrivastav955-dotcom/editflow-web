<?php
/**
 * EditFlow – PHP Demo (Module 1 Academic Requirement)
 * Demonstrates: Form handling, email validation, MySQL connectivity, sessions.
 *
 * Place this file in your local PHP server's web root (e.g., XAMPP/htdocs).
 * Update the DB credentials below before running.
 */

session_start();

// ─── Database configuration ────────────────────────────────────────────────
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';            // update this
$db_name = 'editflow';

// ─── Connect to MySQL ──────────────────────────────────────────────────────
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    die('<p style="color:red;">Database connection failed: ' . htmlspecialchars($conn->connect_error) . '</p>');
}

$error   = '';
$success = '';

// ─── Handle form submission ────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // ── Register ───────────────────────────────
    if ($action === 'register') {
        $name     = trim($_POST['name']     ?? '');
        $email    = trim($_POST['email']    ?? '');
        $password = trim($_POST['password'] ?? '');
        $role     = trim($_POST['role']     ?? '');

        // Validate
        if (empty($name) || empty($email) || empty($password) || empty($role)) {
            $error = 'All fields are required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters.';
        } elseif (!in_array($role, ['client', 'editor', 'admin'])) {
            $error = 'Invalid role selected.';
        } else {
            // Check duplicate email
            $stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $error = 'This email is already registered.';
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $ins  = $conn->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
                $ins->bind_param('ssss', $name, $email, $hash, $role);

                if ($ins->execute()) {
                    $_SESSION['user'] = [
                        'id'    => $ins->insert_id,
                        'name'  => $name,
                        'email' => $email,
                        'role'  => $role,
                    ];
                    $success = 'Registration successful! Welcome, ' . htmlspecialchars($name) . '.';
                } else {
                    $error = 'Registration failed. Please try again.';
                }
                $ins->close();
            }
            $stmt->close();
        }
    }

    // ── Login ──────────────────────────────────
    elseif ($action === 'login') {
        $email    = trim($_POST['email']    ?? '');
        $password = trim($_POST['password'] ?? '');

        if (empty($email) || empty($password)) {
            $error = 'Email and password are required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } else {
            $stmt = $conn->prepare('SELECT id, name, email, password, role FROM users WHERE email = ?');
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                if (password_verify($password, $row['password'])) {
                    $_SESSION['user'] = [
                        'id'    => $row['id'],
                        'name'  => $row['name'],
                        'email' => $row['email'],
                        'role'  => $row['role'],
                    ];
                    $success = 'Login successful! Welcome back, ' . htmlspecialchars($row['name']) . '.';
                } else {
                    $error = 'Invalid email or password.';
                }
            } else {
                $error = 'Invalid email or password.';
            }
            $stmt->close();
        }
    }

    // ── Logout ─────────────────────────────────
    elseif ($action === 'logout') {
        session_destroy();
        $success = 'You have been logged out.';
    }
}

$loggedIn = isset($_SESSION['user']);
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EditFlow – PHP Demo</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 60px auto; padding: 0 1rem; }
    h1   { color: #6366f1; }
    input, select { width: 100%; padding: 8px; margin: 6px 0 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    button { background: #6366f1; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%; font-size: 1rem; }
    button:hover { background: #4f46e5; }
    .error   { background: #fef2f2; border-left: 4px solid #ef4444; padding: 10px; margin-bottom: 12px; color: #991b1b; }
    .success { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 10px; margin-bottom: 12px; color: #166534; }
    .tabs    { display: flex; gap: 10px; margin-bottom: 20px; }
    .tabs a  { flex: 1; text-align: center; padding: 8px; border: 1px solid #6366f1; border-radius: 4px; color: #6366f1; text-decoration: none; }
    .tabs a.active { background: #6366f1; color: #fff; }
    label    { font-weight: 600; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>✂️ EditFlow – PHP Demo</h1>
  <p style="color:#64748b; font-size:0.85rem;">Academic demonstration: Form handling · Email validation · MySQL · Sessions</p>

  <?php if ($error):   ?><div class="error">  <?= htmlspecialchars($error)   ?></div><?php endif; ?>
  <?php if ($success): ?><div class="success"><?= htmlspecialchars($success) ?></div><?php endif; ?>

  <?php if ($loggedIn): ?>
    <p>Logged in as: <strong><?= htmlspecialchars($_SESSION['user']['name']) ?></strong>
       (<?= htmlspecialchars($_SESSION['user']['role']) ?>)</p>
    <form method="POST">
      <input type="hidden" name="action" value="logout" />
      <button type="submit">Logout</button>
    </form>

  <?php else: ?>
    <?php $tab = $_GET['tab'] ?? 'login'; ?>
    <div class="tabs">
      <a href="?tab=login"    class="<?= $tab === 'login'    ? 'active' : '' ?>">Login</a>
      <a href="?tab=register" class="<?= $tab === 'register' ? 'active' : '' ?>">Register</a>
    </div>

    <?php if ($tab === 'register'): ?>
    <form method="POST">
      <input type="hidden" name="action" value="register" />

      <label for="name">Full Name *</label>
      <input id="name" name="name" type="text" required placeholder="Satyam Sharma"
             value="<?= htmlspecialchars($_POST['name'] ?? '') ?>" />

      <label for="email">Email *</label>
      <input id="email" name="email" type="email" required placeholder="you@example.com"
             value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" />

      <label for="password">Password *</label>
      <input id="password" name="password" type="password" required placeholder="Min. 6 characters" />

      <label for="role">Role *</label>
      <select id="role" name="role" required>
        <option value="">— Select role —</option>
        <option value="client" <?= (($_POST['role'] ?? '') === 'client') ? 'selected' : '' ?>>Client</option>
        <option value="editor" <?= (($_POST['role'] ?? '') === 'editor') ? 'selected' : '' ?>>Editor</option>
        <option value="admin"  <?= (($_POST['role'] ?? '') === 'admin')  ? 'selected' : '' ?>>Admin</option>
      </select>

      <button type="submit">Create Account</button>
    </form>

    <?php else: ?>
    <form method="POST">
      <input type="hidden" name="action" value="login" />

      <label for="email">Email *</label>
      <input id="email" name="email" type="email" required placeholder="you@example.com"
             value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" />

      <label for="password">Password *</label>
      <input id="password" name="password" type="password" required placeholder="Your password" />

      <button type="submit">Sign In</button>
    </form>
    <?php endif; ?>
  <?php endif; ?>
</body>
</html>
