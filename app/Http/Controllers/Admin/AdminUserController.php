<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Daftar semua pengguna dengan role 'petani', paginate 20.
     */
    public function index(): Response
    {
        $users = User::where('role', 'petani')
            ->withCount(['lahans', 'diseaseScans'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Detail pengguna beserta lahan-lahannya.
     * Hanya bisa mengakses data petani — bukan sesama admin.
     */
    public function show(User $user): Response
    {
        abort_if($user->role !== 'petani', 403);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user->load(['lahans:id,user_id,nama_lahan,luas_m2,is_active,kabupaten']),
        ]);
    }

    /**
     * Toggle status is_active pengguna.
     * Jika dinonaktifkan, semua sesi aktif user tersebut dihapus.
     */
    public function toggle(User $user): RedirectResponse
    {
        $newStatus = !$user->is_active;

        $user->update(['is_active' => $newStatus]);

        // Jika user dinonaktifkan, hapus semua sesi aktif milik user tersebut
        // agar mereka ter-logout secara otomatis
        if (!$newStatus) {
            DB::table('sessions')->where('user_id', $user->id)->delete();
        }

        $message = $newStatus
            ? "Pengguna {$user->name} berhasil diaktifkan."
            : "Pengguna {$user->name} berhasil dinonaktifkan.";

        return redirect()->back()->with('success', $message);
    }
}
