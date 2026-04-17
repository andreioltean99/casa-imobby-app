<?php

use App\Http\Controllers\Dashboard\AboutDashboardController;
use App\Http\Controllers\Dashboard\AboutItemDashboardController;
use App\Http\Controllers\Dashboard\ContactSettingsDashboardController;
use App\Http\Controllers\Dashboard\LandingHeroDashboardController;
use App\Http\Controllers\Dashboard\LegalPageDashboardController;
use App\Http\Controllers\Dashboard\MediaUploadController;
use App\Http\Controllers\Dashboard\PortfolioDashboardController;
use App\Http\Controllers\Dashboard\PrincipleDashboardController;
use App\Http\Controllers\Dashboard\TestimonialDashboardController;
use App\Http\Controllers\Dashboard\UsersDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeadOfferSubmissionController;
use App\Http\Controllers\LegalPageController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PublicContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::post('/lead-offers', LeadOfferSubmissionController::class)
    ->middleware('throttle:15,1')
    ->name('lead-offers.store');
Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
Route::get('/portfolio/{slug}', [PortfolioController::class, 'show'])->name('portfolio.show');
Route::get('/terms', [LegalPageController::class, 'terms'])->name('terms');
Route::get('/privacy', [LegalPageController::class, 'privacy'])->name('privacy');
Route::get('/contact', PublicContactController::class)->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('dashboard/portfolio', [PortfolioDashboardController::class, 'index'])
        ->name('dashboard.portfolio.index');
    Route::get('dashboard/portfolio/create', [PortfolioDashboardController::class, 'create'])
        ->name('dashboard.portfolio.create');
    Route::post('dashboard/portfolio', [PortfolioDashboardController::class, 'store'])
        ->name('dashboard.portfolio.store');
    Route::get('dashboard/portfolio/{portfolioItem}/edit', [PortfolioDashboardController::class, 'edit'])
        ->name('dashboard.portfolio.edit');
    Route::put('dashboard/portfolio/{portfolioItem}', [PortfolioDashboardController::class, 'update'])
        ->name('dashboard.portfolio.update');
    Route::delete('dashboard/portfolio/{portfolioItem}', [PortfolioDashboardController::class, 'destroy'])
        ->name('dashboard.portfolio.destroy');
    Route::post('dashboard/portfolio/{portfolioItem}/gallery', [PortfolioDashboardController::class, 'storeGalleryImage'])
        ->name('dashboard.portfolio.gallery.store');
    Route::delete('dashboard/portfolio/{portfolioItem}/gallery/{image}', [PortfolioDashboardController::class, 'destroyGalleryImage'])
        ->name('dashboard.portfolio.gallery.destroy');

    Route::get('dashboard/testimonials', [TestimonialDashboardController::class, 'index'])
        ->name('dashboard.testimonials.index');
    Route::get('dashboard/testimonials/create', [TestimonialDashboardController::class, 'create'])
        ->name('dashboard.testimonials.create');
    Route::post('dashboard/testimonials', [TestimonialDashboardController::class, 'store'])
        ->name('dashboard.testimonials.store');
    Route::get('dashboard/testimonials/{testimonial}/edit', [TestimonialDashboardController::class, 'edit'])
        ->name('dashboard.testimonials.edit');
    Route::put('dashboard/testimonials/{testimonial}', [TestimonialDashboardController::class, 'update'])
        ->name('dashboard.testimonials.update');
    Route::delete('dashboard/testimonials/{testimonial}', [TestimonialDashboardController::class, 'destroy'])
        ->name('dashboard.testimonials.destroy');

    Route::get('dashboard/about', [AboutDashboardController::class, 'index'])
        ->name('dashboard.about.index');
    Route::put('dashboard/about', [AboutDashboardController::class, 'update'])
        ->name('dashboard.about.update');

    Route::get('dashboard/about-items/create', [AboutItemDashboardController::class, 'create'])
        ->name('dashboard.about-items.create');
    Route::post('dashboard/about-items', [AboutItemDashboardController::class, 'store'])
        ->name('dashboard.about-items.store');
    Route::get('dashboard/about-items/{aboutItem}/edit', [AboutItemDashboardController::class, 'edit'])
        ->name('dashboard.about-items.edit');
    Route::put('dashboard/about-items/{aboutItem}', [AboutItemDashboardController::class, 'update'])
        ->name('dashboard.about-items.update');
    Route::delete('dashboard/about-items/{aboutItem}', [AboutItemDashboardController::class, 'destroy'])
        ->name('dashboard.about-items.destroy');

    Route::get('dashboard/principles/create', [PrincipleDashboardController::class, 'create'])
        ->name('dashboard.principles.create');
    Route::post('dashboard/principles', [PrincipleDashboardController::class, 'store'])
        ->name('dashboard.principles.store');
    Route::get('dashboard/principles/{principle}/edit', [PrincipleDashboardController::class, 'edit'])
        ->name('dashboard.principles.edit');
    Route::put('dashboard/principles/{principle}', [PrincipleDashboardController::class, 'update'])
        ->name('dashboard.principles.update');
    Route::delete('dashboard/principles/{principle}', [PrincipleDashboardController::class, 'destroy'])
        ->name('dashboard.principles.destroy');

    Route::get('dashboard/legal/terms', [LegalPageDashboardController::class, 'editTerms'])
        ->name('dashboard.legal.terms.edit');
    Route::put('dashboard/legal/terms', [LegalPageDashboardController::class, 'updateTerms'])
        ->name('dashboard.legal.terms.update');

    Route::get('dashboard/legal/privacy', [LegalPageDashboardController::class, 'editPrivacy'])
        ->name('dashboard.legal.privacy.edit');
    Route::put('dashboard/legal/privacy', [LegalPageDashboardController::class, 'updatePrivacy'])
        ->name('dashboard.legal.privacy.update');

    Route::get('dashboard/contact', [ContactSettingsDashboardController::class, 'edit'])
        ->name('dashboard.contact.edit');
    Route::put('dashboard/contact', [ContactSettingsDashboardController::class, 'update'])
        ->name('dashboard.contact.update');

    Route::get('dashboard/landing-hero', [LandingHeroDashboardController::class, 'edit'])
        ->name('dashboard.landing-hero.edit');
    Route::put('dashboard/landing-hero', [LandingHeroDashboardController::class, 'update'])
        ->name('dashboard.landing-hero.update');

    Route::get('dashboard/users', [UsersDashboardController::class, 'index'])
        ->name('dashboard.users.index');
    Route::get('dashboard/users/create', [UsersDashboardController::class, 'create'])
        ->name('dashboard.users.create');
    Route::post('dashboard/users', [UsersDashboardController::class, 'store'])
        ->name('dashboard.users.store');
    Route::get('dashboard/users/{user}/edit', [UsersDashboardController::class, 'edit'])
        ->name('dashboard.users.edit');
    Route::put('dashboard/users/{user}', [UsersDashboardController::class, 'update'])
        ->name('dashboard.users.update');
    Route::delete('dashboard/users/{user}', [UsersDashboardController::class, 'destroy'])
        ->name('dashboard.users.destroy');

    Route::post('dashboard/uploads/legal-image', [MediaUploadController::class, 'storeLegalImage'])
        ->name('dashboard.uploads.legal-image');
});

Route::get('/lang/{locale}', [LocaleController::class, 'switch'])
    ->name('locale.switch');

require __DIR__.'/settings.php';
