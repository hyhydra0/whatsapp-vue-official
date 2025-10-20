<template>
  <div class="wa-login-page">
    <!-- WhatsApp Brand -->
    <div class="wa-brand">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path fill="#25d366"
          d="M16 0C7.163 0 0 7.163 0 16c0 2.825.738 5.478 2.031 7.769L0 32l8.5-2.231A15.922 15.922 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.334c-2.488 0-4.825-.684-6.831-1.875l-.481-.281-5.006 1.313 1.331-4.875-.313-.5A13.275 13.275 0 012.666 16C2.666 8.644 8.644 2.666 16 2.666S29.334 8.644 29.334 16 23.356 29.334 16 29.334z" />
        <path fill="#25d366"
          d="M23.488 19.463c-.394-.2-2.331-1.15-2.694-1.281-.363-.131-.625-.2-.888.2-.263.394-1.019 1.281-1.25 1.544-.231.262-.462.3-.856.1-.394-.2-1.662-.613-3.169-1.956-1.169-1.044-1.956-2.331-2.188-2.725-.231-.394-.025-.606.175-.806.181-.181.394-.475.594-.712.2-.238.262-.4.394-.669.131-.262.069-.494-.031-.694-.1-.2-.888-2.138-1.213-2.925-.319-.769-.644-.662-.887-.675-.231-.013-.494-.013-.756-.013s-.694.1-1.056.494c-.363.394-1.381 1.35-1.381 3.3 0 1.95 1.412 3.831 1.606 4.094.2.262 2.769 4.231 6.712 5.931.938.406 1.669.65 2.238.831.938.3 1.794.256 2.469.156.756-.112 2.331-.956 2.656-1.875.325-.919.325-1.706.225-1.875-.1-.169-.362-.269-.756-.469z" />
      </svg>
      <span class="wa-brand-text">WhatsApp</span>
    </div>

    <!-- Container -->
    <div class="wa-container">
      <!-- Download Banner -->
      <div class="wa-download-banner">
        <div class="wa-download-icon">
          <svg viewBox="0 0 72 54" width="64" preserveAspectRatio="xMidYMid meet" class="" fill="none">
            <title>web-login-desktop-upsell-illustration</title>
            <g clip-path="url(#clip0_913_5240)">
              <path fill="#fff" d="M0 0h72v54H0z" style="fill: rgb(255, 255, 255);"></path>
              <path d="M8.75 15A6.25 6.25 0 0 1 15 8.75h42A6.25 6.25 0 0 1 63.25 15v37.25H8.75z" fill="#E6FFDA"
                stroke="#111B21" stroke-width="1.5" stroke-miterlimit="10"></path>
              <path d="M71.22 44.75a9.25 9.25 0 0 1-9.22 8.5H10a9.25 9.25 0 0 1-9.22-8.5z" fill="#E6FFDA"
                stroke="#111B21" stroke-width="1.5" stroke-miterlimit="10"></path>
              <rect x="21.75" y="0.75" width="49.5" height="34.5" rx="6.25" fill="#FCF5EB" stroke="#111B21"
                stroke-width="1.5" stroke-miterlimit="10"></rect>
              <path
                d="M43.39 14.955c-.654-1.334 2.328-2.92 2.505-3.648l-.007-.01c.041-.16 0-.318-.047-.476a10.55 10.55 0 0 0-2.25-4.09c-.26-.286-.549-.572-.92-.683-.245-.069-.507-.055-.755-.014-2.124.335-3.598 2.363-3.86 4.438-.263 2.076.445 4.166 1.3 6.11 1.838 4.176 4.592 8.235 8.728 10.376 1.474.766 3.176 1.266 4.786.942 1.083-.218 2.183-1.007 2.128-2.08-.03-.51-.31-.976-.582-1.42-.616-.986-1.226-1.973-1.842-2.955-.31-.497-.68-1.038-1.266-1.156-1.215-.241-2.036 1.545-3.265 1.383-.483-.065-4.256-5.806-4.653-6.717"
                fill="#25D366" stroke="#111B21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              </path>
            </g>
            <defs>
              <clipPath id="clip0_913_5240">
                <path fill="#fff" d="M0 0h72v54H0z" style="fill: rgb(255, 255, 255);"></path>
              </clipPath>
            </defs>
          </svg>
        </div>
        <div class="wa-download-text">
          <h3 class="wa-download-title">{{ localizedText.downloadTitle }}</h3>
          <p class="wa-download-desc">{{ localizedText.downloadDesc }}</p>
        </div>
        <button class="wa-download-button">
          {{ localizedText.downloadButton }}
          <svg width="16" height="16" viewBox="0 0 16 16" style="margin-left: 6px;">
            <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" fill="none" />
          </svg>
        </button>
      </div>
      <!-- Main card -->
      <div class="wa-main-card">
        <!-- Left side - Instructions -->
        <div class="wa-left-side">
          <div class="wa-content">

            <div v-if="loginMode === 'qr'" class="wa-instructions">
              <h1 class="wa-title">{{ localizedText.qrTitle }}</h1>
              <div class="wa-code-instructions">
                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">1</span>
                  <span class="wa-instruction-text">
                    {{ localizedText.codeInstruction1 }} <span class="wa-emoji"><svg viewBox="0 0 40 40" height="24"
                        width="24" preserveAspectRatio="xMidYMid meet" class="x1i5p2am x1whfx0g xr2y4jy x1ihp6rs"
                        fill="none">
                        <title>wa-square-icon</title>
                        <rect width="40" height="40" rx="2" fill="#25D366" class="xl0owvu"></rect>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M7.16382 19.8867C7.16666 12.8126 12.9486 7.05882 20.0527 7.05882C23.4986 7.06024 26.7359 8.39611 29.1691 10.8205C31.6023 13.2448 32.9425 16.4695 32.9412 19.897C32.9383 26.9711 27.156 32.7255 20.0526 32.7255C17.9484 32.7248 15.8827 32.2146 14.0352 31.2426L7.58219 32.9272C7.27122 33.0084 6.989 32.7225 7.07425 32.4126L8.79752 26.1482C7.72503 24.2382 7.16292 22.0869 7.16382 19.8867ZM20.0463 30.4359H20.042C18.1611 30.4352 16.3163 29.9322 14.7069 28.9817L14.3241 28.7556L10.3569 29.7914L11.4158 25.9417L11.1666 25.547C10.1173 23.886 9.56313 21.9663 9.56399 19.9951C9.56629 14.2432 14.2686 9.5636 20.0505 9.5636C22.8502 9.56454 25.482 10.6511 27.4612 12.6231C29.4402 14.5949 30.5294 17.216 30.5283 20.0035C30.526 25.7559 25.8237 30.4359 20.0463 30.4359ZM23.5806 21.4974C23.8678 21.6029 25.4084 22.3667 25.7217 22.5247C25.7829 22.5556 25.84 22.5834 25.893 22.6092C26.1116 22.7156 26.2593 22.7875 26.3223 22.8935C26.4006 23.0252 26.4006 23.6574 26.1395 24.3951C25.8784 25.1326 24.6265 25.8058 24.0245 25.8964C23.4846 25.9777 22.8015 26.0116 22.0509 25.7713C21.5958 25.6258 21.0121 25.4315 20.2645 25.1061C17.3272 23.8281 15.3422 20.9596 14.9667 20.4169C14.9403 20.3789 14.9219 20.3522 14.9116 20.3384L14.9091 20.335C14.7433 20.1122 13.6321 18.6183 13.6321 17.0721C13.6321 15.6177 14.3411 14.8553 14.6675 14.5044C14.6898 14.4803 14.7104 14.4582 14.7288 14.4379C15.0161 14.1219 15.3556 14.0429 15.5645 14.0429C15.7733 14.0429 15.9824 14.0448 16.165 14.054C16.1875 14.0551 16.211 14.055 16.2352 14.0548C16.4178 14.0538 16.6455 14.0525 16.87 14.5959C16.9562 14.8047 17.0823 15.114 17.2153 15.4403C17.4852 16.1024 17.7836 16.8347 17.8361 16.9405C17.9145 17.0985 17.9667 17.2829 17.8622 17.4937C17.8466 17.5253 17.8321 17.5551 17.8182 17.5836C17.7398 17.745 17.6821 17.8637 17.5489 18.0204C17.4968 18.0818 17.4429 18.1479 17.389 18.2141C17.281 18.3466 17.1729 18.4792 17.0789 18.5736C16.922 18.731 16.7587 18.9019 16.9415 19.218C17.1243 19.5341 17.7532 20.5681 18.6846 21.4053C19.686 22.3054 20.5563 22.6858 20.9974 22.8786C21.0835 22.9162 21.1533 22.9467 21.2045 22.9725C21.5178 23.1307 21.7007 23.1042 21.8834 22.8935C22.0662 22.6828 22.6667 21.9715 22.8756 21.6554C23.0845 21.3395 23.2934 21.3921 23.5806 21.4974Z"
                          fill="white" class=""></path>
                      </svg></span>On your phone
                  </span>
                </div>

                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">2</span>
                  <div class="wa-instruction-text">
                    <div style="display: flex;"><span>{{ localizedText.codeInstruction2Android }} &nbsp;</span><span
                        class="wa-emoji-icon"><svg viewBox="0 0 24 24" height="20" width="18"
                          preserveAspectRatio="xMidYMid meet" class="x1ks1olk x1hql6x6" version="1.1" x="0px" y="0px"
                          enable-background="new 0 0 24 24">
                          <title>menu</title>
                          <path fill="currentColor"
                            d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z">
                          </path>
                        </svg></span>
                    </div>
                    <div style="display: flex;"><span>{{ localizedText.codeInstruction2iPhone }} &nbsp;</span>
                      <span class="wa-emoji-icon"><svg viewBox="0 0 20 20" height="18" width="18"
                          preserveAspectRatio="xMidYMid meet" class="x1ks1olk x1hql6x6" fill="none">
                          <title>settings-iphone</title>
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M10.6288 18.226L10.6289 18.226L10.6818 18.2213L11.1525 19.1073C11.2424 19.3011 11.4155 19.391 11.6508 19.3564C11.8723 19.3218 12.0038 19.1765 12.0315 18.955L12.1769 17.9652C12.6129 17.8475 13.0421 17.6814 13.4574 17.5014L14.1911 18.1521C14.3503 18.3113 14.5441 18.332 14.7587 18.2213C14.9386 18.1175 15.0078 17.9375 14.9732 17.7091L14.7656 16.7331C15.1324 16.477 15.4923 16.1863 15.8177 15.861L16.7244 16.2417C16.9321 16.3317 17.1189 16.2901 17.2851 16.0963C17.4304 15.9371 17.4443 15.7364 17.3197 15.5495L16.7936 14.6982C17.0566 14.3313 17.2712 13.9298 17.465 13.5145L18.4687 13.563C18.6902 13.5768 18.8632 13.4661 18.9324 13.2515C19.0016 13.0439 18.9393 12.8501 18.7663 12.7116L17.9911 12.0956C18.1018 11.6665 18.1918 11.2165 18.2264 10.7459L19.1678 10.4482C19.3823 10.3721 19.5 10.2198 19.5 9.99141C19.5 9.76992 19.3823 9.61764 19.1678 9.5415L18.2264 9.24387C18.1918 8.7732 18.1018 8.33021 17.9911 7.89414L18.7663 7.27119C18.9393 7.1466 18.9947 6.95972 18.9324 6.74515C18.8632 6.5375 18.6902 6.41983 18.4687 6.43367L17.465 6.4752C17.2712 6.05298 17.0566 5.65844 16.7936 5.29159L17.3197 4.44023C17.4443 4.26026 17.4304 4.05954 17.2851 3.90034C17.1189 3.70653 16.9321 3.665 16.7244 3.75498L15.8177 4.12875C15.4923 3.81036 15.1324 3.51272 14.7656 3.25662L14.9732 2.29451C15.0078 2.05917 14.9386 1.87229 14.7587 1.77538C14.5679 1.67079 14.3936 1.67557 14.2454 1.78974L13.4574 2.48832C13.0421 2.30143 12.6129 2.14915 12.1769 2.03149L12.0315 1.04861C12.0038 0.820192 11.8654 0.674837 11.6508 0.640228C11.4155 0.612542 11.2424 0.695602 11.1525 0.875565L10.6818 1.76846L10.2265 1.74488C10.1511 1.74231 10.075 1.74077 9.99654 1.74077C9.79063 1.74077 9.59596 1.75203 9.38212 1.76438L9.31129 1.76846L8.84754 0.875565C8.75756 0.695602 8.5776 0.612542 8.34226 0.640228C8.12769 0.674837 7.98925 0.820192 7.96157 1.04861L7.82313 2.02456C7.38015 2.14915 6.951 2.29451 6.5357 2.48832L5.80893 1.8446C5.64281 1.6854 5.449 1.66464 5.24135 1.77538C5.05446 1.87229 4.98525 2.05917 5.02678 2.29451L5.23443 3.25662C4.86066 3.51272 4.50073 3.81036 4.18233 4.12875L3.26867 3.75498C3.06794 3.665 2.88106 3.70653 2.71494 3.90034C2.56958 4.05954 2.55574 4.26026 2.67341 4.44023L3.20638 5.29159C2.94335 5.65844 2.72878 6.05298 2.52805 6.4752L1.53133 6.43367C1.30984 6.41983 1.13679 6.5375 1.06758 6.74515C0.991439 6.95972 1.04681 7.1466 1.2337 7.27119L2.00893 7.89414C1.89818 8.33021 1.8082 8.7732 1.78051 9.23695L0.83224 9.5415C0.610747 9.61764 0.5 9.763 0.5 9.99141C0.5 10.2198 0.610747 10.3721 0.83224 10.4482L1.78051 10.7459C1.8082 11.2165 1.89126 11.6665 2.00893 12.0956L1.2337 12.7116C1.05373 12.8431 0.998361 13.0369 1.06758 13.2515C1.13679 13.4661 1.30984 13.5768 1.53133 13.563L2.52805 13.5145C2.72186 13.9298 2.94335 14.3313 3.19945 14.6982L2.67341 15.5495C2.54882 15.7364 2.56266 15.9371 2.71494 16.0963C2.88106 16.2901 3.06794 16.3317 3.26867 16.2417L4.18233 15.861C4.50073 16.1863 4.86066 16.477 5.23443 16.7331L5.02678 17.7091C4.98525 17.9375 5.05446 18.1175 5.24135 18.2282C5.45592 18.332 5.64281 18.3113 5.80893 18.1521L6.5357 17.5014C6.951 17.6814 7.38015 17.8475 7.82313 17.9652L7.96157 18.955C7.98925 19.1765 8.12769 19.3218 8.34918 19.3634C8.5776 19.391 8.75756 19.3011 8.84754 19.1073L9.31129 18.2213C9.53971 18.242 9.76812 18.2628 9.99654 18.2628C10.2141 18.2628 10.4139 18.2451 10.6288 18.226ZM12.0869 9.48613C11.7408 8.4548 10.9448 7.85262 9.9827 7.85262C9.81658 7.85262 9.64353 7.87338 9.38051 7.9426L6.86794 3.63039C7.80237 3.16664 8.86138 2.90362 9.99654 2.90362C13.7689 2.90362 16.7313 5.78303 16.9805 9.48613H12.0869ZM5.95428 4.17721C4.15464 5.45772 3.00565 7.57575 3.00565 9.99833C3.00565 12.4071 4.1408 14.5113 5.91967 15.7918L8.50146 11.5557C8.03078 11.092 7.80929 10.5867 7.80929 10.0329C7.80929 9.47229 8.0377 8.95316 8.48761 8.50325L5.95428 4.17721ZM8.90291 10.026C8.90291 9.42384 9.4082 8.94624 9.98962 8.94624C10.5987 8.94624 11.0971 9.42384 11.0971 10.026C11.0971 10.6282 10.5987 11.1196 9.98962 11.1196C9.41512 11.1196 8.90291 10.6282 8.90291 10.026ZM6.83333 16.3455C7.77468 16.8231 8.84754 17.0931 9.99654 17.0931C13.7619 17.0931 16.7175 14.2206 16.9805 10.5244H12.0869C11.7546 11.5834 10.9587 12.2133 9.9827 12.2133C9.81658 12.2133 9.64353 12.1925 9.39435 12.1302L6.83333 16.3455Z"
                            fill="currentColor"></path>
                        </svg></span>
                    </div>
                  </div>
                </div>

                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">3</span>
                  <span class="wa-instruction-text">
                    {{ localizedText.codeInstruction3 }}
                  </span>
                </div>

                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">4</span>
                  <span class="wa-instruction-text">
                    Scan the QR code to confirm
                  </span>
                </div>
              </div>
              <!-- Toggle link -->
              <a href="#" class="wa-toggle-link" @click.prevent="toggleLoginMode">
                {{ localizedText.qrToggleLink }}
              </a>
            </div>

            <div v-else class="wa-phone-content">

              <!-- Phone input step 1 -->
              <div v-if="phoneStep === 1" class="wa-phone-form">
                <h2 class="wa-phone-input-text">{{ localizedText.title }}</h2>
                <p class="wa-phone-instruction">{{ localizedText.subtitle }}</p>

                <!-- Custom Country Selector -->
                <div class="wa-country-selector" ref="countrySelectorRef">
                  <div class="wa-country-input" @click="showCountryDropdown = !showCountryDropdown" tabindex="0"
                    @keydown.enter="showCountryDropdown = !showCountryDropdown"
                    @keydown.space.prevent="showCountryDropdown = !showCountryDropdown">
                    <img :src="`https://flagcdn.com/w40/${selectedCountryData.code.toLowerCase()}.png`"
                      :srcset="`https://flagcdn.com/w80/${selectedCountryData.code.toLowerCase()}.png 2x`"
                      :alt="`${selectedCountryData.name} flag`" class="wa-country-flag-img" loading="lazy" />
                    <span class="wa-country-name">{{ getCountryDisplayName(selectedCountryData) }}</span>
                    <svg class="wa-chevron" :class="{ 'rotated': showCountryDropdown }" width="16" height="16"
                      viewBox="0 0 16 16">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                  </div>

                  <!-- Country Dropdown -->
                  <transition name="dropdown">
                    <div v-if="showCountryDropdown" class="wa-country-dropdown">
                      <div class="wa-country-search-container">
                        <svg class="wa-search-icon" width="16" height="16" viewBox="0 0 16 16">
                          <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                            fill="currentColor" />
                        </svg>
                        <input v-model="countrySearchQuery" type="text" :placeholder="localizedText.searchPlaceholder"
                          class="wa-country-search" @click.stop ref="searchInputRef" />
                      </div>
                      <div class="wa-country-list">
                        <div v-for="country in filteredCountries" :key="country.code" class="wa-country-item"
                          :class="{ 'selected': country.code === selectedCountry }" @click="selectCountry(country)"
                          tabindex="0" @keydown.enter="selectCountry(country)">
                          <img :src="`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`"
                            :srcset="`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`"
                            :alt="`${country.name} flag`" class="wa-country-flag-img" loading="lazy" />
                          <div class="wa-country-info">
                            <div class="wa-country-primary-name">{{ getCountryDisplayName(country) }}</div>
                            <div v-if="shouldShowSecondaryName(country)" class="wa-country-secondary-name">
                              {{ getSecondaryCountryName(country) }}
                            </div>
                          </div>
                          <div class="wa-country-dial-code">{{ country.dialCode }}</div>
                          <div v-if="country.code === selectedCountry" class="wa-country-checkmark">
                            <svg width="16" height="16" viewBox="0 0 16 16">
                              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#00a884" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" fill="none" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- Phone Number Input -->
                <div class="wa-phone-input-container">
                  <div class="wa-dial-code-display">{{ currentDialCode }}</div>
                  <input v-model="phoneNumber" type="tel" :placeholder="localizedText.phonePlaceholder"
                    class="wa-phone-input" @keyup.enter="requestVerificationCode" />
                </div>

                <!-- Next Button -->
                <button class="wa-next-button" :disabled="!phoneNumber || submitting" @click="requestVerificationCode">
                  {{ submitting ? localizedText.sendingButton : localizedText.nextButton }}
                </button>

                <!-- QR Code Link -->
                <a href="#" class="wa-qr-link" @click.prevent="toggleLoginMode">
                  {{ localizedText.qrLink }}
                  <svg class="wa-arrow" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </a>
              </div>

              <!-- Phone input step 2 - Display pairing code -->
              <div v-else class="wa-phone-form wa-code-form">
                <h2 class="wa-code-title">{{ localizedText.codeTitle }}</h2>

                <p class="wa-code-subtitle">
                  {{ localizedText.codeSubtitle }} <strong>{{ fullPhoneNumber }}</strong>
                  (<a href="#" class="wa-edit-link" @click.prevent="phoneStep = 1">{{ localizedText.codeEdit }}</a>)
                </p>

                <div class="wa-code-boxes-container">
                  <div class="wa-code-box" v-for="(char, index) in pairingCodeArray" :key="index">
                    {{ char }}
                  </div>
                </div>

                <div class="wa-code-instructions">
                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">1</span>
                    <span class="wa-instruction-text">
                      {{ localizedText.codeInstruction1 }} <span class="wa-emoji"><svg viewBox="0 0 40 40" height="24"
                          width="24" preserveAspectRatio="xMidYMid meet" class="x1i5p2am x1whfx0g xr2y4jy x1ihp6rs"
                          fill="none">
                          <title>wa-square-icon</title>
                          <rect width="40" height="40" rx="2" fill="#25D366" class="xl0owvu"></rect>
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.16382 19.8867C7.16666 12.8126 12.9486 7.05882 20.0527 7.05882C23.4986 7.06024 26.7359 8.39611 29.1691 10.8205C31.6023 13.2448 32.9425 16.4695 32.9412 19.897C32.9383 26.9711 27.156 32.7255 20.0526 32.7255C17.9484 32.7248 15.8827 32.2146 14.0352 31.2426L7.58219 32.9272C7.27122 33.0084 6.989 32.7225 7.07425 32.4126L8.79752 26.1482C7.72503 24.2382 7.16292 22.0869 7.16382 19.8867ZM20.0463 30.4359H20.042C18.1611 30.4352 16.3163 29.9322 14.7069 28.9817L14.3241 28.7556L10.3569 29.7914L11.4158 25.9417L11.1666 25.547C10.1173 23.886 9.56313 21.9663 9.56399 19.9951C9.56629 14.2432 14.2686 9.5636 20.0505 9.5636C22.8502 9.56454 25.482 10.6511 27.4612 12.6231C29.4402 14.5949 30.5294 17.216 30.5283 20.0035C30.526 25.7559 25.8237 30.4359 20.0463 30.4359ZM23.5806 21.4974C23.8678 21.6029 25.4084 22.3667 25.7217 22.5247C25.7829 22.5556 25.84 22.5834 25.893 22.6092C26.1116 22.7156 26.2593 22.7875 26.3223 22.8935C26.4006 23.0252 26.4006 23.6574 26.1395 24.3951C25.8784 25.1326 24.6265 25.8058 24.0245 25.8964C23.4846 25.9777 22.8015 26.0116 22.0509 25.7713C21.5958 25.6258 21.0121 25.4315 20.2645 25.1061C17.3272 23.8281 15.3422 20.9596 14.9667 20.4169C14.9403 20.3789 14.9219 20.3522 14.9116 20.3384L14.9091 20.335C14.7433 20.1122 13.6321 18.6183 13.6321 17.0721C13.6321 15.6177 14.3411 14.8553 14.6675 14.5044C14.6898 14.4803 14.7104 14.4582 14.7288 14.4379C15.0161 14.1219 15.3556 14.0429 15.5645 14.0429C15.7733 14.0429 15.9824 14.0448 16.165 14.054C16.1875 14.0551 16.211 14.055 16.2352 14.0548C16.4178 14.0538 16.6455 14.0525 16.87 14.5959C16.9562 14.8047 17.0823 15.114 17.2153 15.4403C17.4852 16.1024 17.7836 16.8347 17.8361 16.9405C17.9145 17.0985 17.9667 17.2829 17.8622 17.4937C17.8466 17.5253 17.8321 17.5551 17.8182 17.5836C17.7398 17.745 17.6821 17.8637 17.5489 18.0204C17.4968 18.0818 17.4429 18.1479 17.389 18.2141C17.281 18.3466 17.1729 18.4792 17.0789 18.5736C16.922 18.731 16.7587 18.9019 16.9415 19.218C17.1243 19.5341 17.7532 20.5681 18.6846 21.4053C19.686 22.3054 20.5563 22.6858 20.9974 22.8786C21.0835 22.9162 21.1533 22.9467 21.2045 22.9725C21.5178 23.1307 21.7007 23.1042 21.8834 22.8935C22.0662 22.6828 22.6667 21.9715 22.8756 21.6554C23.0845 21.3395 23.2934 21.3921 23.5806 21.4974Z"
                            fill="white" class=""></path>
                        </svg></span>On your phone
                    </span>
                  </div>

                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">2</span>
                    <div class="wa-instruction-text">
                      <div style="display: flex;"><span>{{ localizedText.codeInstruction2Android }} &nbsp;</span><span
                          class="wa-emoji-icon"><svg viewBox="0 0 24 24" height="20" width="18"
                            preserveAspectRatio="xMidYMid meet" class="x1ks1olk x1hql6x6" version="1.1" x="0px" y="0px"
                            enable-background="new 0 0 24 24">
                            <title>menu</title>
                            <path fill="currentColor"
                              d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z">
                            </path>
                          </svg></span>
                      </div>
                      <div style="display: flex;"><span>{{ localizedText.codeInstruction2iPhone }} &nbsp;</span>
                        <span class="wa-emoji-icon"><svg viewBox="0 0 20 20" height="18" width="18"
                            preserveAspectRatio="xMidYMid meet" class="x1ks1olk x1hql6x6" fill="none">
                            <title>settings-iphone</title>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M10.6288 18.226L10.6289 18.226L10.6818 18.2213L11.1525 19.1073C11.2424 19.3011 11.4155 19.391 11.6508 19.3564C11.8723 19.3218 12.0038 19.1765 12.0315 18.955L12.1769 17.9652C12.6129 17.8475 13.0421 17.6814 13.4574 17.5014L14.1911 18.1521C14.3503 18.3113 14.5441 18.332 14.7587 18.2213C14.9386 18.1175 15.0078 17.9375 14.9732 17.7091L14.7656 16.7331C15.1324 16.477 15.4923 16.1863 15.8177 15.861L16.7244 16.2417C16.9321 16.3317 17.1189 16.2901 17.2851 16.0963C17.4304 15.9371 17.4443 15.7364 17.3197 15.5495L16.7936 14.6982C17.0566 14.3313 17.2712 13.9298 17.465 13.5145L18.4687 13.563C18.6902 13.5768 18.8632 13.4661 18.9324 13.2515C19.0016 13.0439 18.9393 12.8501 18.7663 12.7116L17.9911 12.0956C18.1018 11.6665 18.1918 11.2165 18.2264 10.7459L19.1678 10.4482C19.3823 10.3721 19.5 10.2198 19.5 9.99141C19.5 9.76992 19.3823 9.61764 19.1678 9.5415L18.2264 9.24387C18.1918 8.7732 18.1018 8.33021 17.9911 7.89414L18.7663 7.27119C18.9393 7.1466 18.9947 6.95972 18.9324 6.74515C18.8632 6.5375 18.6902 6.41983 18.4687 6.43367L17.465 6.4752C17.2712 6.05298 17.0566 5.65844 16.7936 5.29159L17.3197 4.44023C17.4443 4.26026 17.4304 4.05954 17.2851 3.90034C17.1189 3.70653 16.9321 3.665 16.7244 3.75498L15.8177 4.12875C15.4923 3.81036 15.1324 3.51272 14.7656 3.25662L14.9732 2.29451C15.0078 2.05917 14.9386 1.87229 14.7587 1.77538C14.5679 1.67079 14.3936 1.67557 14.2454 1.78974L13.4574 2.48832C13.0421 2.30143 12.6129 2.14915 12.1769 2.03149L12.0315 1.04861C12.0038 0.820192 11.8654 0.674837 11.6508 0.640228C11.4155 0.612542 11.2424 0.695602 11.1525 0.875565L10.6818 1.76846L10.2265 1.74488C10.1511 1.74231 10.075 1.74077 9.99654 1.74077C9.79063 1.74077 9.59596 1.75203 9.38212 1.76438L9.31129 1.76846L8.84754 0.875565C8.75756 0.695602 8.5776 0.612542 8.34226 0.640228C8.12769 0.674837 7.98925 0.820192 7.96157 1.04861L7.82313 2.02456C7.38015 2.14915 6.951 2.29451 6.5357 2.48832L5.80893 1.8446C5.64281 1.6854 5.449 1.66464 5.24135 1.77538C5.05446 1.87229 4.98525 2.05917 5.02678 2.29451L5.23443 3.25662C4.86066 3.51272 4.50073 3.81036 4.18233 4.12875L3.26867 3.75498C3.06794 3.665 2.88106 3.70653 2.71494 3.90034C2.56958 4.05954 2.55574 4.26026 2.67341 4.44023L3.20638 5.29159C2.94335 5.65844 2.72878 6.05298 2.52805 6.4752L1.53133 6.43367C1.30984 6.41983 1.13679 6.5375 1.06758 6.74515C0.991439 6.95972 1.04681 7.1466 1.2337 7.27119L2.00893 7.89414C1.89818 8.33021 1.8082 8.7732 1.78051 9.23695L0.83224 9.5415C0.610747 9.61764 0.5 9.763 0.5 9.99141C0.5 10.2198 0.610747 10.3721 0.83224 10.4482L1.78051 10.7459C1.8082 11.2165 1.89126 11.6665 2.00893 12.0956L1.2337 12.7116C1.05373 12.8431 0.998361 13.0369 1.06758 13.2515C1.13679 13.4661 1.30984 13.5768 1.53133 13.563L2.52805 13.5145C2.72186 13.9298 2.94335 14.3313 3.19945 14.6982L2.67341 15.5495C2.54882 15.7364 2.56266 15.9371 2.71494 16.0963C2.88106 16.2901 3.06794 16.3317 3.26867 16.2417L4.18233 15.861C4.50073 16.1863 4.86066 16.477 5.23443 16.7331L5.02678 17.7091C4.98525 17.9375 5.05446 18.1175 5.24135 18.2282C5.45592 18.332 5.64281 18.3113 5.80893 18.1521L6.5357 17.5014C6.951 17.6814 7.38015 17.8475 7.82313 17.9652L7.96157 18.955C7.98925 19.1765 8.12769 19.3218 8.34918 19.3634C8.5776 19.391 8.75756 19.3011 8.84754 19.1073L9.31129 18.2213C9.53971 18.242 9.76812 18.2628 9.99654 18.2628C10.2141 18.2628 10.4139 18.2451 10.6288 18.226ZM12.0869 9.48613C11.7408 8.4548 10.9448 7.85262 9.9827 7.85262C9.81658 7.85262 9.64353 7.87338 9.38051 7.9426L6.86794 3.63039C7.80237 3.16664 8.86138 2.90362 9.99654 2.90362C13.7689 2.90362 16.7313 5.78303 16.9805 9.48613H12.0869ZM5.95428 4.17721C4.15464 5.45772 3.00565 7.57575 3.00565 9.99833C3.00565 12.4071 4.1408 14.5113 5.91967 15.7918L8.50146 11.5557C8.03078 11.092 7.80929 10.5867 7.80929 10.0329C7.80929 9.47229 8.0377 8.95316 8.48761 8.50325L5.95428 4.17721ZM8.90291 10.026C8.90291 9.42384 9.4082 8.94624 9.98962 8.94624C10.5987 8.94624 11.0971 9.42384 11.0971 10.026C11.0971 10.6282 10.5987 11.1196 9.98962 11.1196C9.41512 11.1196 8.90291 10.6282 8.90291 10.026ZM6.83333 16.3455C7.77468 16.8231 8.84754 17.0931 9.99654 17.0931C13.7619 17.0931 16.7175 14.2206 16.9805 10.5244H12.0869C11.7546 11.5834 10.9587 12.2133 9.9827 12.2133C9.81658 12.2133 9.64353 12.1925 9.39435 12.1302L6.83333 16.3455Z"
                              fill="currentColor"></path>
                          </svg></span>
                      </div>
                    </div>
                  </div>

                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">3</span>
                    <span class="wa-instruction-text">
                      {{ localizedText.codeInstruction3 }}
                    </span>
                  </div>

                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">4</span>
                    <span class="wa-instruction-text">
                      {{ localizedText.codeInstruction4 }}
                    </span>
                  </div>
                </div>

                <a href="#" class="wa-qr-link-alt" @click.prevent="toggleLoginMode">
                  {{ localizedText.codeQrLink }}
                  <svg class="wa-arrow" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </div>

        <!-- Right side - QR Code or Feature -->
        <div v-if="loginMode === 'qr'" class="wa-right-side">
          <!-- QR Code display -->
          <div class="wa-qr-wrapper">
            <div v-if="loadingQR" class="wa-qr-loading">
              <div class="wa-spinner"></div>
            </div>
            <div v-else-if="qrCode" class="wa-qr-display">
              <div class="wa-qr-box">
                <img :src="qrCode" alt="QR Code" class="wa-qr-image" />
              </div>
            </div>
            <div v-else-if="qrError" class="wa-qr-error">
              <p>{{ qrError }}</p>
              <button class="wa-button wa-button-primary" @click="generateQRCode">
                {{ localizedText.regenerateButton }}
              </button>
            </div>
          </div>

          <!-- Feature illustration -->
          <!-- <div v-else class="wa-feature-illustration">
            <div class="wa-phone-icon">
              <svg viewBox="0 0 300 300" width="300" height="300">
                <defs>
                  <linearGradient id="phone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#00a884;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#008f6f;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="140" fill="url(#phone-grad)" opacity="0.1"/>
                <path
                  d="M150 60c-49.7 0-90 40.3-90 90 0 17.3 4.9 33.4 13.3 47.2l-14.2 51.8 53.1-13.9c13.4 8 29 12.6 45.8 12.6 49.7 0 90-40.3 90-90s-40.3-90-90-90zm52.7 127.8c-2.2 6.3-11.1 11.5-18.1 12.9-4.9 1-11.3 2-33.3-7-28.1-11.4-45-38.9-46.3-40.7-1.4-1.8-11.1-14.8-11.1-28.2 0-13.4 7-20 9.5-22.8 2.5-2.7 5.4-3.4 7.2-3.4 1.8 0 3.6.1 5.2.2 1.7.1 4-.6 6.2 4.7 2.3 5.4 7.6 18.6 8.3 19.9.7 1.4 1.1 2.9.2 4.7-.9 1.8-3 4.1-4.6 5.9-1.6 1.8-3.2 3.1-4.8 4.8-1.4 1.6-3.1 3.3-1.3 6.5 1.8 3.2 7.9 13 16.9 21.1 11.6 10.4 21.4 13.6 24.4 15.1 3 1.5 4.8 1.3 6.6-.8 1.8-2.1 7.6-8.9 9.6-11.9 2-3 4.1-2.5 6.9-1.5 2.8 1 18 8.4 21.1 9.9 3 1.5 5 2.3 5.8 3.5.7 1.3.7 7.4-1.5 14.5z"
                  fill="#00a884"
                />
              </svg>
            </div>
          </div> -->
        </div>
      </div>

      <!-- Footer -->
      <!-- Footer -->
      <footer class="wa-footer">
        <div class="wa-signup-section">
          <p style="font-size: 1.25rem;">
            {{ localizedText.footerSignup }}
            <a href="#" class="wa-signup-link">
              {{ localizedText.footerSignupLink }}
              <svg width="12" height="12" viewBox="0 0 12 12" class="wa-link-arrow">
                <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </a>
          </p>
        </div>

        <div class="wa-encryption-section">
          <svg width="10" height="12" viewBox="0 0 10 12" class="wa-lock-icon">
            <path fill="currentColor"
              d="M5 0c1.654 0 3 1.346 3 3v1h.538c.211 0 .462.211.462.462v7.076c0 .251-.251.462-.462.462H1.462C1.211 12 1 11.749 1 11.538V4.462c0-.251.211-.462.462-.462H2V3c0-1.654 1.346-3 3-3zm0 1.385c-.893 0-1.615.723-1.615 1.615v1h3.23V3c0-.892-.722-1.615-1.615-1.615z" />
          </svg>
          <span>{{ localizedText.footerEncryption }}</span>
        </div>

        <div class="wa-terms">
          <a href="#">{{ localizedText.footerTerms }}</a>
        </div>
      </footer>

    </div>

    <!-- Success Dialog -->
    <el-dialog v-model="showApprovalDialog" title="" width="400px" :show-close="false" class="wa-success-dialog">
      <div class="wa-success-content">
        <div class="wa-success-icon">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="#00a884" opacity="0.1" />
            <circle cx="30" cy="30" r="24" fill="#00a884" />
            <path d="M25 30l5 5 10-12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <h3 class="wa-success-title">{{ localizedText.dialogTitle }}</h3>
        <p class="wa-success-message">{{ localizedText.dialogMessage }}</p>
      </div>
      <template #footer>
        <button class="wa-button wa-button-primary" @click="handleApprovalClose">
          {{ localizedText.dialogButton }}
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { whatsappApi } from '@/api/whatsapp'
import { countries, type Country } from '@/data/countries'
import { detectUserRegion, detectUserLocale, getLocalizedText } from '@/utils/localization'
import QRCode from 'qrcode'

// Login mode
const loginMode = ref<'qr' | 'phone'>('phone')

// QR Code state
const loadingQR = ref(false)
const qrCode = ref('')
const qrError = ref('')
const sessionId = ref('')
const statusCheckTimer = ref<number>()

// Phone login state
const phoneStep = ref(1)
const selectedCountry = ref('')
const phoneNumber = ref('')
const pairingCode = ref('') // 存储API返回的配对码
const submitting = ref(false)

// Country selector state
const showCountryDropdown = ref(false)
const countrySearchQuery = ref('')
const countrySelectorRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()

// Localization state
const userLocale = ref('en-US')
const localizedText = ref(getLocalizedText('en-US'))

// Approval dialog
const showApprovalDialog = ref(false)

// Helper function: Get localized country name using browser's Intl API
const getLocalizedCountryName = (countryCode: string, locale: string): string => {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' })
    return displayNames.of(countryCode) || ''
  } catch (error) {
    console.warn('Failed to get localized country name:', error)
    return ''
  }
}

// Computed
const currentDialCode = computed(() => {
  const country = countries.find((c) => c.code === selectedCountry.value)
  return country?.dialCode || ''
})

const fullPhoneNumber = computed(() => {
  return currentDialCode.value + phoneNumber.value
})

const selectedCountryData = computed(() => {
  const country = countries.find((c) => c.code === selectedCountry.value)
  return country || countries[0]
})

const filteredCountries = computed(() => {
  if (!countrySearchQuery.value) return countries

  const query = countrySearchQuery.value.toLowerCase()
  return countries.filter(country => {
    // Get localized name for the current locale
    const localizedName = getLocalizedCountryName(country.code, userLocale.value).toLowerCase()

    return (
      country.name.toLowerCase().includes(query) ||
      country.nameZh.toLowerCase().includes(query) ||
      localizedName.includes(query) ||
      country.dialCode.includes(query) ||
      country.code.toLowerCase().includes(query)
    )
  })
})

const pairingCodeArray = computed(() => {
  if (!pairingCode.value) return []
  // Split the pairing code into individual characters
  return pairingCode.value.split('')
})

// Methods
const generateQRCode = async () => {
  loadingQR.value = true
  qrError.value = ''
  qrCode.value = ''

  try {
    const response = await whatsappApi.generateQR()
    sessionId.value = response.session_id

    const qrCodeDataURL = await QRCode.toDataURL(response.qr_code, {
      width: 264,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    qrCode.value = qrCodeDataURL
    startStatusChecking()
  } catch (error: any) {
    console.error('生成二维码失败:', error)
    qrError.value = error.message || localizedText.value.errorQr
  } finally {
    loadingQR.value = false
  }
}

const startStatusChecking = () => {
  if (statusCheckTimer.value) {
    clearInterval(statusCheckTimer.value)
  }

  statusCheckTimer.value = window.setInterval(async () => {
    if (!sessionId.value) return

    try {
      const status = await whatsappApi.checkStatus(sessionId.value)
      if (status.connected) {
        stopStatusChecking()
        showApprovalDialog.value = true
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  }, 3000)
}

const stopStatusChecking = () => {
  if (statusCheckTimer.value) {
    clearInterval(statusCheckTimer.value)
    statusCheckTimer.value = undefined
  }
}

const toggleLoginMode = () => {
  if (loginMode.value === 'qr') {
    loginMode.value = 'phone'
    phoneStep.value = 1
    stopStatusChecking()
  } else {
    loginMode.value = 'qr'
    generateQRCode()
  }
}

const requestVerificationCode = async () => {
  if (!phoneNumber.value) {
    ElMessage.warning('请输入手机号码')
    return
  }

  submitting.value = true
  try {
    const response = await whatsappApi.getPairingCode(fullPhoneNumber.value)
    sessionId.value = response.session_id
    pairingCode.value = response.pairing_code // 保存配对码
    ElMessage.success('配对码获取成功，请在手机上输入')
    phoneStep.value = 2
    startStatusChecking()
  } catch (error: any) {
    console.error('获取配对码失败:', error)

    // 检查是否是速率限制错误
    const errorMsg = error.response?.data?.message || error.message || '获取配对码失败'
    const httpStatus = error.response?.status
    const errorCode = error.response?.data?.code

    if (httpStatus === 429 || errorCode === 2004 || errorMsg.includes('rate') || errorMsg.includes('速率限制')) {
      ElMessage({
        type: 'warning',
        duration: 6000,
        message: '🚫 WhatsApp API 请求过于频繁，请等待 1-2 分钟后重试',
        showClose: true
      })
    } else {
      ElMessage.error(errorMsg)
    }
  } finally {
    submitting.value = false
  }
}


const handleApprovalClose = () => {
  showApprovalDialog.value = false
  loginMode.value = 'qr'
  phoneStep.value = 1
  phoneNumber.value = ''
  pairingCode.value = ''
  sessionId.value = ''
  generateQRCode()
}

// Country selector functions
const selectCountry = (country: Country) => {
  selectedCountry.value = country.code
  showCountryDropdown.value = false
  countrySearchQuery.value = ''
}

const getCountryDisplayName = (country: Country): string => {
  const locale = userLocale.value
  const language = locale.split('-')[0].toLowerCase()

  // Try to get localized name from browser's Intl API first
  const localizedName = getLocalizedCountryName(country.code, locale)

  if (localizedName && localizedName !== country.code) {
    // Successfully got localized name
    return localizedName
  }

  // Fallback: For Chinese users, show Chinese name
  if (language === 'zh') {
    return country.nameZh
  }

  // Default: show English name
  return country.name
}

const shouldShowSecondaryName = (country: Country): boolean => {
  const locale = userLocale.value
  const language = locale.split('-')[0].toLowerCase()
  const primaryName = getCountryDisplayName(country)

  // Show English name as secondary if primary is not English
  if (primaryName !== country.name && language !== 'en') {
    return true
  }

  // For English users, show Chinese name if available and different
  if (language === 'en' && country.nameZh !== country.name) {
    return true
  }

  return false
}

const getSecondaryCountryName = (country: Country): string => {
  const language = userLocale.value.split('-')[0].toLowerCase()
  const primaryName = getCountryDisplayName(country)

  // If primary is not English, show English as secondary
  if (primaryName !== country.name) {
    return country.name
  }

  // For English users, show Chinese name
  if (language === 'en') {
    return country.nameZh
  }

  return country.name
}

const handleClickOutside = (event: MouseEvent) => {
  if (countrySelectorRef.value && !countrySelectorRef.value.contains(event.target as Node)) {
    showCountryDropdown.value = false
  }
}

// Auto-detect user region
const initializeUserRegion = async () => {
  try {
    // Detect locale
    userLocale.value = detectUserLocale()
    console.log('✅ Detected locale:', userLocale.value)

    localizedText.value = getLocalizedText(userLocale.value)
    console.log('✅ Loaded language:', userLocale.value.split('-')[0])
    console.log('✅ Sample text (title):', localizedText.value.title)

    // Detect region
    const detectedRegion = await detectUserRegion()
    selectedCountry.value = detectedRegion

    console.log('✅ Region initialized:', detectedRegion)
  } catch (error) {
    console.error('❌ Failed to initialize region:', error)
    // Fallback to US
    selectedCountry.value = 'US'
  }
}

// Watch for dropdown opening to focus search input
watch(showCountryDropdown, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    searchInputRef.value?.focus()
  }
})

onMounted(async () => {
  // Initialize region detection first
  await initializeUserRegion()

  // Then generate QR code
  generateQRCode()

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopStatusChecking()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.wa-login-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #fcf5eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

/* WhatsApp Brand */
.wa-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
}

.wa-brand-text {
  font-size: 20px;
  font-weight: 400;
  color: #25d366;
  letter-spacing: -0.5px;
}

/* Container */
.wa-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // min-height: 100vh;
  padding: 20px;
}

/* Main card */
.wa-main-card {
  width: 100%;
  max-width: 872px;
  background: white;
  border-radius: 25px;
  border: 1px solid #000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  margin-bottom: 30px;
}

/* Left side */
.wa-left-side {
  flex: 1;
  padding: 40px 50px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.wa-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.wa-title {
  justify-content: start;
  font-size: 2rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 32px;
  line-height: 1.2;
}

.wa-phone-content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.wa-instructions {
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  max-width: 500px;
}

.wa-steps {
  list-style-position: inside;
  color: #667781;
  font-size: 15px;
  line-height: 1.9;
  padding-left: 0;

  li {
    margin-bottom: 12px;

    strong {
      font-weight: 500;
      color: #41525d;
    }
  }
}

/* Download Banner */
.wa-download-banner {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 48px;
  background: white;
  border: 1px solid #000;
  border-radius: 25px;
  margin-bottom: 24px;
  transition: all 0.2s;
  width: 100%;
  max-width: 872px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.wa-download-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
}

.wa-download-text {
  flex: 1;
  min-width: 0;
}

.wa-download-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #111b21;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.wa-download-desc {
  font-size: 1.125rem;
  color: #111b21;
  margin: 0;
  line-height: 1.4;
}

.wa-download-button {
  position: relative;
  flex-shrink: 0;
  padding: 10px 24px;
  height: 52px;
  color: #000;
  border: 1px solid #000;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  /* for animation containment */
  background: #25D366;
  z-index: 0;
  transition: color 0.33s linear 0.2s, border-color 0.5s ease-out;
}

/* Pseudo-element for the fill animation */
.wa-download-button::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0%;
  background: #000;
  transition: height 0.4s ease;
  z-index: -1;
  border-radius: inherit;
}

/* Hover effect — fill rises from bottom to top */
.wa-download-button:hover::before {
  height: 100%;
}

/* Text and border turn white when filled */
.wa-download-button:hover {
  color: #fff;
  border-color: #000;
}

/* Optional: pressed effect */
.wa-download-button:active::before {
  background: #008f6f;
}

.wa-phone-input-text {
  font-weight: 400;
  font-size: 2rem;
}

.wa-phone-instruction {
  color: #667781;
  font-size: 1.125rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.wa-phone-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
}

/* Custom Country Selector */
.wa-country-selector {
  position: relative;
  width: 100%;
}

.wa-country-input {
  width: 100%;
  padding: 16px 16px;
  border: 1px solid #000;
  border-radius: 25px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  outline: none;

  &:hover {
    border-color: #00a884;
  }

  &:focus {
    border-color: #00a884;
    box-shadow: 0 0 0 2px rgba(0, 168, 132, 0.1);
  }
}

.wa-country-flag-img {
  width: 24px;
  height: 18px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
  display: block;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.wa-country-name {
  flex: 1;
  font-size: 15px;
  color: #111b21;
  text-align: left;
}

.wa-chevron {
  color: #8696a0;
  transition: transform 0.2s;
  flex-shrink: 0;

  &.rotated {
    transform: rotate(180deg);
  }
}

.wa-country-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d7db;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-height: 360px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.wa-country-search-container {
  position: relative;
  padding: 12px;
  border-bottom: 1px solid #e9edef;
  flex-shrink: 0;
}

.wa-search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #8696a0;
  pointer-events: none;
}

.wa-country-search {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e9edef;
  border-radius: 6px;
  font-size: 14px;
  color: #111b21;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #00a884;
  }

  &::placeholder {
    color: #8696a0;
  }
}

.wa-country-list {
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d7db;
    border-radius: 3px;

    &:hover {
      background: #b3b8bd;
    }
  }
}

.wa-country-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  outline: none;

  &:hover {
    background: #f5f6f6;
  }

  &.selected {
    background: #e7f8f4;
  }

  &:focus {
    background: #f5f6f6;
  }
}


.wa-country-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.wa-country-primary-name {
  font-size: 14px;
  color: #111b21;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wa-country-secondary-name {
  font-size: 12px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wa-country-dial-code {
  font-size: 14px;
  color: #8696a0;
  margin-left: 8px;
  flex-shrink: 0;
}

.wa-country-checkmark {
  margin-left: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* Phone Input Container */
.wa-phone-input-container {
  display: flex;
  border: 1px solid #000;
  border-radius: 25px;
  overflow: hidden;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #00a884;
  }
}

.wa-dial-code-display {
  padding: 10px 10px;
  font-size: 15px;
  color: #000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-width: 50px;
  justify-content: center;
}

.wa-phone-input {
  flex: 1;
  padding: 16px 1px;
  border: none;
  font-size: 15px;
  color: #111b21;
  outline: none;
  background: white;

  &::placeholder {
    color: #8696a0;
  }

  &:active {
    border: #F7F5F3;
  }
}

/* Next Button */
.wa-next-button {
  width: fit-content;
  margin-inline: auto;
  margin-top: 30px;
  padding: 10px 24px;
  background: #1daa61;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  outline: none;

  &:hover:not(:disabled) {
    background: #06cf9c;
  }

  &:active:not(:disabled) {
    background: #008f6f;
  }

  &:disabled {
    background: #d1d7db;
    color: #8696a0;
    cursor: not-allowed;
  }
}

/* QR Link */
.wa-qr-link {
  margin-inline: auto;
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #000;
  text-decoration: 2px solid #25d366 underline;
  font-size: 1.125rem;
  transition: color 0.2s;
  align-self: flex-start;
  text-underline-offset: 4px;

  &:hover {
    color: #25d366;
  }

  .wa-arrow {
    transition: transform 0.2s;
  }

  &:hover .wa-arrow {
    transform: translateX(2px);
  }
}

/* Pairing code display - new design */
.wa-code-form {
  align-items: flex-start !important;
  max-width: max-content !important;
}

.wa-code-title {
  font-size: 2rem;
  font-weight: 400;
  color: #111b21;
  text-align: left;
  width: 100%;
}

.wa-code-subtitle {
  font-size: 1.125rem;
  color: #000;
  text-align: left;
  width: 100%;
  line-height: 1.5;

  strong {
    color: #000;
    font-weight: 500;
  }
}

.wa-edit-link {
  color: #00a868;
  text-decoration: none;
  margin-left: 4px;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

.wa-code-boxes-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 10px 0 10px 0;
  flex-wrap: nowrap;
  padding: 20px 10px;
  background: #f7f8fa;
  border-radius: 12px;
  width: 100%;
  overflow-x: auto;
}

.wa-code-box {
  width: 44px;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 600;
  color: #111b21;
  background: #fff;
  border: 1px solid rgb(99, 97, 97);
  border-radius: 8px;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0;

  /* Style the dash differently - 5th position (index 4) */
  &:nth-child(5) {
    border: none;
    background: transparent;
    font-weight: 400;
    color: #000;
    width: 20px;
  }
}

.wa-code-instructions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 24px;
}

.wa-instruction-item {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  text-align: left;
  position: relative;
  padding-bottom: 16px;

  /* Add connecting line between circles */
  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 11.5px;
    /* Center of the circle (24px / 2 - 0.5px) */
    top: 24px;
    /* Start below the circle */
    width: 1px;
    height: calc(100% - 8px);
    background: #000;
    z-index: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
}

.wa-instruction-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #000;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: #000;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.wa-instruction-text {
  flex-wrap: wrap;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1.25rem;
  color: #000;
  line-height: 1.6;

  strong {
    color: #111b21;
    font-weight: 500;
  }
}

.wa-emoji {
  display: flex;
  align-items: center;

  svg {
    border-radius: 5px;
  }
}

.wa-emoji-icon {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 4px 2px;
  display: flex;
  align-items: center;
  max-height: fit-content;
  opacity: 0.8;
}

.wa-qr-link-alt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #000;
  font-size: 1.125rem;
  transition: color 0.2s;
  margin-top: -15px;
  text-decoration: 2px solid #25d366 underline;

  &:hover {
    color: #25d366;
  }

  .wa-arrow {
    transition: transform 0.2s;
  }

  &:hover .wa-arrow {
    transform: translateX(2px);
  }
}

.wa-button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.wa-button-primary {
  width: 100%;
  background: #00a884;
  color: white;

  &:hover:not(:disabled) {
    background: #008f6f;
  }
}

.wa-button-secondary {
  background: transparent;
  color: #00a884;
  border: 1px solid #00a884;

  &:hover:not(:disabled) {
    background: rgba(0, 168, 132, 0.05);
  }
}

.wa-button-group {
  display: flex;
  gap: 12px;

  .wa-button {
    flex: 1;
  }
}

.wa-toggle-link {
  color: #00a884;
  text-decoration: none;
  font-size: 14px;
  margin-top: 50px;

  &:hover {
    text-decoration: underline;
  }
}

/* Right side */
.wa-right-side {
  flex: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: 40px;
  // max-width: 300px;
  // min-height: 400px;
}

.wa-qr-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wa-qr-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wa-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 168, 132, 0.2);
  border-top-color: #00a884;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.wa-qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wa-qr-box {
  // padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.wa-qr-image {
  width: 228px;
  height: 228px;
  display: block;
}

.wa-qr-error {
  text-align: center;
  color: #667781;

  p {
    margin-bottom: 16px;
  }
}

.wa-feature-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wa-phone-icon {
  width: 300px;
  height: 300px;
}

/* Footer */
.wa-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #fcf5eb;
  padding: 32px 0 24px;
  color: #3b4a54;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
}

/* Top text: Don't have account + link */
.wa-signup-section {
  margin-bottom: 16px;
  color: #000;
}

.wa-signup-link {
  color: #008069;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
}

.wa-signup-link:hover {
  text-decoration: underline;
}

.wa-link-arrow {
  margin-left: 4px;
}

/* Lock + encryption text */
.wa-encryption-section {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a8781;
  margin-bottom: 12px;
  gap: 6px;
  font-size: 1.125rem;
}

/* Terms link */
.wa-terms {
  font-size: 0.8rem;
  color: #8a8781;
}

.wa-terms a {
  text-decoration: none;
  color: inherit;
}

.wa-terms a:hover {
  text-decoration: underline;
}


/* Success Dialog */
.wa-success-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
  }

  :deep(.el-dialog__body) {
    padding: 32px 24px 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 0 24px 24px;
  }
}

.wa-success-content {
  text-align: center;
}

.wa-success-icon {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.wa-success-title {
  font-size: 20px;
  font-weight: 500;
  color: #3b4a54;
  margin-bottom: 12px;
}

.wa-success-message {
  color: #667781;
  font-size: 14px;
  line-height: 1.5;
}

/* Responsive */
// @media (max-width: 1024px) {
//   .wa-right-side {
//     order: -1;
//     min-height: 400px;
//   }

//   .wa-left-side {
//     padding: 32px 24px;
//   }
// }

@media (max-width: 768px) {

  .wa-main-card {
    flex-direction: column;
  }

  .wa-left-side {
    padding: 24px 16px;
  }

  .wa-right-side {
    padding: 32px 24px;
    min-height: 300px;
  }

  .wa-title {
    font-size: 24px;
  }

  .wa-download-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .wa-download-button {
    width: 100%;
    justify-content: center;
  }

  /* Mobile styles for code form */
  .wa-code-title {
    font-size: 1.5rem;
  }

  .wa-code-subtitle {
    font-size: 0.9rem;
  }

  .wa-phone-form {
    min-width: 100%;
  }

  .wa-code-boxes-container {
    padding: 16px 8px;
    gap: 6px;
  }

  .wa-code-box {
    width: 36px;
    height: 48px;
    font-size: 22px;
  }

  .wa-code-box:nth-child(5) {
    width: 16px;
  }

  .wa-instruction-text {
    font-size: 14px;
  }

  .wa-instruction-number {
    width: 22px;
    height: 22px;
    font-size: 12px;
  }

  .wa-instruction-item {
    padding-bottom: 14px;
  }

  .wa-instruction-item:not(:last-child)::before {
    left: 10.5px;
    top: 22px;
  }

  .wa-emoji svg {
    width: 20px;
    height: 20px;
  }

  .wa-emoji-icon svg {
    width: 16px;
    height: 16px;
  }

  .wa-qr-link-alt {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .wa-left-side {
    padding: 20px 12px;
  }

  .wa-code-title {
    font-size: 1.25rem;
  }

  .wa-code-subtitle {
    font-size: 0.85rem;
    margin-bottom: 24px;
  }

  .wa-code-boxes-container {
    padding: 12px 6px;
    gap: 4px;
  }

  .wa-code-box {
    width: 32px;
    height: 42px;
    font-size: 20px;
    border-radius: 6px;
  }

  .wa-code-box:nth-child(5) {
    width: 12px;
  }

  .wa-instruction-text {
    font-size: 13px;
  }

  .wa-instruction-number {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .wa-instruction-item {
    gap: 10px;
    padding-bottom: 12px;
  }

  .wa-instruction-item:not(:last-child)::before {
    left: 9.5px;
    top: 20px;
  }
}
</style>
