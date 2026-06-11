# CRITICAL FIXES CHECKLIST

## 🔴 BLOCKING ISSUES - FIX IMMEDIATELY

### 1. Backend APP_KEY Missing
```bash
cd Backend
php artisan key:generate
```
**File affected:** `Backend/.env`

---

### 2. Database Migrations - Create Missing Columns

#### Migration 1: Add is_validated to utilisateurs
```bash
cd Backend
php artisan make:migration add_is_validated_to_utilisateurs_table
```

**File:** `Backend/database/migrations/YYYY_MM_DD_HHMMSS_add_is_validated_to_utilisateurs_table.php`
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->boolean('is_validated')->default(false)->after('role');
        });
    }

    public function down(): void {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropColumn('is_validated');
        });
    }
};
```

#### Migration 2: Add boutique_id to produits
```bash
cd Backend
php artisan make:migration add_boutique_id_to_produits_table
```

**File:** `Backend/database/migrations/YYYY_MM_DD_HHMMSS_add_boutique_id_to_produits_table.php`
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('produits', function (Blueprint $table) {
            $table->foreignId('boutique_id')->nullable()->after('producteur_id')->constrained('boutiques')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['boutique_id']);
            $table->dropColumn('boutique_id');
        });
    }
};
```

#### Migration 3: Ensure produits_json exists in typeproduits
**File:** `Backend/database/migrations/2026_05_25_160739_add_produits_json_to_typeproduits_table.php`
- Verify this migration exists and has been run
- If missing, run: `php artisan migrate --path=database/migrations/2026_05_25_160739_add_produits_json_to_typeproduits_table.php`

**Then run all:**
```bash
php artisan migrate
```

---

### 3. Fix Produit Model - Add Boutique Relationship
**File:** `Backend/app/Models/Produit.php`

ADD to the class:
```php
public function boutique()
{
    return $this->belongsTo(Boutique::class, 'boutique_id');
}
```

---

### 4. Fix Route Typo in Dashboard React
**File:** `dashboard/src/App.jsx`

**FIND:**
```jsx
<Route path="/marcher" element={<MarchePublic />} />
```

**REPLACE WITH:**
```jsx
<Route path="/marche" element={<MarchePublic />} />
```

---

### 5. Add Environment Configuration to Dashboard
**File:** `dashboard/.env`

**CHANGE FROM:**
```
VITE_WEATHER_KEY="6689e4ba61a8ae2290b45fe47f3eb2b5"
```

**TO:**
```
VITE_API_URL=http://127.0.0.1:8000/api
VITE_WEATHER_KEY=6689e4ba61a8ae2290b45fe47f3eb2b5
```

---

### 6. Update axios.js to Use Environment Variable
**File:** `dashboard/src/api/axios.js`

**FIND:**
```javascript
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
```

**REPLACE WITH:**
```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
```

---

### 7. Fix Flutter Hardcoded IP
**File:** `Flutter_app/lib/services/api_service.dart`

**FIND:**
```dart
static const String _apiBaseUrl = 'http://192.168.43.152:8000/api';
```

**REPLACE WITH:**
```dart
// Configuration IP du backend
// Local dev: http://localhost:8000/api (web only)
// Emulateur Android: http://10.0.2.2:8000/api
// Device WiFi: change IP to your machine IP
// iOS Simulator: http://localhost:8000/api
static const String _apiBaseUrl = 'http://192.168.x.x:8000/api'; // ← CHANGE THIS
```

**OR create config file:**
```dart
class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://192.168.43.152:8000/api'
  );
}
```

---

### 8. Delete Duplicate Flutter Files
```bash
cd Flutter_app/lib/screens
rm producteur_screen_final.dart
rm producteur_screen_final_clean2.dart
rm producteur_screen_final_new.dart
rm patch.txt
```

---

## ⚠️ IMPORTANT: Backend Controllers

### Issue in AuthController.registerProducteur
**File:** `Backend/app/Http/Controllers/API/AuthController.php` (around line 152)

**Current problematic pattern:**
```php
if ($role === 'producteur') {
    $utilisateur->producteur()->create([...]);
}
```

**Issue:** Uses wrong relationship (hasOne instead of creating proper association)

**Better approach - Already implemented, just verify it works:**
Check lines 138-165 for proper Producteur::create() pattern

---

### CommandeController.scopeProducteurAccess
**File:** `Backend/app/Http/Controllers/API/CommandeController.php` (line 18)

**Issue:** Method returns query but not used as a scope

**Usage Pattern in index():**
```php
public function index(Request $request)
{
    $query = Commande::with('client.utilisateur', 'produit.producteur.utilisateur');
    
    // Apply scope
    $this->scopeProducteurAccess($query); // ← Problem: $query is passed by reference?
```

**Fix:** Either make it a real query scope or rewrite:
```php
private function applyProducteurFilter($query)
{
    $user = request()->user();
    $producteurId = $this->producteurIdFromUser($user);

    if ($producteurId) {
        return $query->whereHas('produit.producteur', function ($q) use ($producteurId) {
            $q->where('id', $producteurId);
        });
    }
    
    return $query;
}

// Usage:
$query = $this->applyProducteurFilter($query);
```

---

## 📝 Create Missing .env.example Files

### Backend
**File:** `Backend/.env.example`
```
APP_NAME="kob-app"
APP_ENV=local
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=priscilleprojets_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync

MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="KOB App"

ADMIN_PASSWORD=admin1234
```

### Dashboard
**File:** `dashboard/.env.example`
```
# API Configuration
VITE_API_URL=http://127.0.0.1:8000/api

# Weather API (OpenWeatherMap)
VITE_WEATHER_KEY=your_openweather_api_key_here
```

---

## 🧪 Verification Checklist

After applying fixes, verify:

- [ ] Backend: `php artisan key:generate` ran successfully
- [ ] Backend: `php artisan migrate` completed without errors
- [ ] Backend: POST /auth/register works with email/password
- [ ] Dashboard: `npm install` completes
- [ ] Dashboard: `npm run dev` starts without errors
- [ ] Dashboard: Login page loads
- [ ] Dashboard: Can navigate to /marche (not /marcher)
- [ ] Dashboard: Admin dashboard loads (calls to /v1/boutiques?all=true)
- [ ] Flutter: App compiles with correct API URL
- [ ] Flutter: Login works with real phone on same WiFi
- [ ] Flutter: No duplicate producteur_screen.dart files exist

---

## 🚨 Testing After Fixes

### Backend Test
```bash
cd Backend
php artisan tinker
# Test basic query:
>>> \App\Models\Utilisateur::count()
>>> \App\Models\TypeProduit::count()
>>> \App\Models\Boutique::count()
```

### Frontend Test
```bash
cd dashboard
npm run lint
npm run build  # Should complete without errors
```

### API Test
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","mot_de_passe":"password"}'
```

---

**Priority:** Complete all BLOCKING ISSUES before testing or deploying  
**Time Estimate:** 2-3 hours for all fixes
