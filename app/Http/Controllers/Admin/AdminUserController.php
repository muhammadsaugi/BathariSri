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

    
    public function show(User $user): Response
    {
        abort_if($user->role !== 'petani', 403);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user->load(['lahans:id,user_id,nama_lahan,luas_m2,is_active,kabupaten']),
        ]);
    }

    
    public function toggle(User $user): RedirectResponse
    {
        $newStatus = !$user->is_active;

        $user->update(['is_active' => $newStatus]);

        
        
        if (!$newStatus) {
            DB::table('sessions')->where('user_id', $user->id)->delete();
        }

        $message = $newStatus
            ? "Pengguna {$user->name} berhasil diaktifkan."
            : "Pengguna {$user->name} berhasil dinonaktifkan.";

        return redirect()->back()->with('success', $message);
    }
}
