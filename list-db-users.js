const { execSync } = require('child_process');

try {
  const cmd = `ssh -n -o BatchMode=yes root@72.61.97.210 "docker exec jari_postgres_db psql -U jari_user -d jari_db -c 'SELECT phone, full_name, role, status FROM users ORDER BY created_at ASC;'"`
  const out = execSync(cmd);
  console.log(out.toString());
} catch (e) {
  console.error(e.message);
}
