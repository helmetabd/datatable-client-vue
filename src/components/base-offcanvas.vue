<script setup lang="ts">
// import { checkShipmentService } from '@/service'
import { watchEffect } from 'vue'
import { reactive, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  fetchParams: {
    type: Object,
    required: true
  },
  fetchOffcanvas: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  isOpen: false,
  data: null,
  loading: false,
  error: ''
})

function getLabel(params: string) {
  if (params == 'DELIVERED') {
    return 'text-success'
  }
  if (params == 'TRANSIT') {
    return 'text-info'
  }
  if (params == 'PENDING') {
    return 'text-warning'
  }
  if (params == 'RETURNED') {
    return 'text-danger'
  }
}

const offcanvasElement = ref(null)

const openOffcanvas = async () => {
  state.isOpen = true
  // await fetchData()
}

const closeOffcanvas = () => {
  state.isOpen = false
}

// const fetchData = async () => {
//   state.loading = true
//   state.error = ''
//   try {
//     const response = await checkShipmentService.check(props.fetchParams.param)
//     state.data = response
//   } catch (err) {
//     state.error = 'Failed to fetch data'
//   } finally {
//     state.loading = false
//   }
// }
watchEffect(() => {
  if (props.fetchParams.param) {
    openOffcanvas()
  }
})
</script>
<template>
  <div
    :class="state.isOpen ? 'show' : ''"
    class="offcanvas offcanvas-end border-0"
    data-bs-backdrop="true"
    tabindex="-1"
    aria-labelledby="offcanvasLabel"
    ref="offcanvasElement"
    id="offcanvasRightTrial"
  >
    <div class="offcanvas-header bg-primary p-3">
      <h5 class="offcanvas-title m-0 text-white" id="offcanvasLabel">{{ title }}</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        @click="closeOffcanvas"
      ></button>
    </div>
    <div class="offcanvas-body">
      <slot name="offcanvasBody"></slot>
      <template v-if="fetchOffcanvas">
        <span class="spinner-border flex-shrink-0" role="status" v-if="state.loading"
          ><span class="visually-hidden">Loading...</span></span
        >
        <p v-else-if="state.error">{{ state.error }}</p>
        <div class="fs-12" v-else>
          <h4 class="card-title">Results:</h4>
          <table class="table table-responsive mb-3">
            <tbody>
              <tr>
                <td>Status:</td>
                <td>
                  <strong>
                    <span
                      v-if="state.data?.tracking?.request_status == 200"
                      :class="getLabel(state.data?.tracking?.results?.awb_status)"
                    >
                      {{ state.data?.tracking?.results?.awb_status }}
                    </span>
                    <span v-else class="text-danger">AWB NOT FOUND (NEW/EXPIRED)</span>
                  </strong>
                </td>
              </tr>
              <tr>
                <td width="30%">AWB#:</td>
                <td>
                  <strong>{{ state.data?.tracking?.request_awb }}</strong> ({{
                    state.data?.tracking?.courier
                  }})
                </td>
              </tr>
              <tr v-if="state.data?.tracking?.request_status == 200">
                <td>Service Type:</td>
                <td>{{ state.data?.tracking?.results.service_type }}</td>
              </tr>
              <tr v-if="state.data?.tracking?.results?.failure_reason">
                <td>Last Fail Reason:</td>
                <td>{{ state.data?.tracking?.results?.failure_reason }}</td>
              </tr>
            </tbody>
          </table>
          <template v-if="state.data?.tracking?.request_status == 200">
            <h4 class="card-title mt-4">Details:</h4>
            <hr />
            <ul
              class="verti-timeline list-unstyled"
              v-for="event in state.data?.tracking?.results.events"
              :key="event"
            >
              <li class="event-list">
                <div>
                  <h6 class="text-info mb-2">
                    <i class="bx bx-right-arrow-circle"></i> {{ event.time }}
                  </h6>
                  <div class="bg-light rounded p-3 mb-3">
                    <div>{{ event.description }}</div>
                    <div class="text-muted" v-if="event.city_hub">{{ event.city_hub }}</div>
                    <code></code>
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <hr />
        </div>
      </template>
    </div>
  </div>
</template>
